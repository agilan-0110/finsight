"""
FinSight — Multi-Broker Statement Ingestion Engine
Parses export files (CSV, XLSX, XLS) from popular Indian discount brokers:
- Zerodha (Kite / Console)
- Groww
- AngelOne
- Upstox
- Generic / Manual format

Uses fuzzy header matching, normalization, and local NSE stock directory resolution.
"""

import io
import re
from typing import BinaryIO
import pandas as pd
from backend.data.data_fetch import search_stocks
from backend.agent.alias_map import ALIAS_MAP
from backend.agent.ticker_map import TICKER_MAP

# Canonical broker column patterns
COLUMN_PATTERNS = {
    "ticker": [
        r"^instrument$", r"^stock\s*name$", r"^symbol$", r"^scrip(\s*name)?$",
        r"^company(\s*name)?$", r"^stock$", r"^security$", r"^asset$"
    ],
    "quantity": [
        r"^qty\.?$", r"^quantity(\s*available)?$", r"^shares$", r"^total\s*qty$"
    ],
    "avg_buy_price": [
        r"^avg\.?\s*cost$", r"^avg\.?\s*price$", r"^average(\s*buy)?(\s*price)?$",
        r"^buy(\s*avg)?(\s*price)?$", r"^cost\s*price$", r"^price$"
    ],
}


def _match_column(col_name: str, pattern_list: list[str]) -> bool:
    clean = col_name.strip().lower()
    for pat in pattern_list:
        if re.search(pat, clean):
            return True
    return False


def _find_column(df_columns: list[str], pattern_list: list[str]) -> str | None:
    for col in df_columns:
        if _match_column(col, pattern_list):
            return col
    return None


def resolve_stock_symbol(raw_name: str) -> tuple[str, str]:
    """
    Given a messy broker row (e.g. 'TATA MOTORS LTD', 'RELIANCE EQ', 'INFOSYS'),
    resolves the canonical NSE ticker (e.g. 'TATAMOTORS.NS') and clean company name.
    Returns: (resolved_ticker_with_dot_ns, display_company_name)
    """
    clean = raw_name.strip()
    # Strip common broker clutter suffixes (EQ, -EQ, LTD, LIMITED, .BO, .NS, etc.)
    clean_no_eq = re.sub(r"\s+-(EQ|BE|SM|ST)$", "", clean, flags=re.IGNORECASE)
    clean_no_eq = re.sub(r"\s+(EQ|BE|SM|ST)$", "", clean_no_eq, flags=re.IGNORECASE)
    clean_no_eq = clean_no_eq.replace(".NS", "").replace(".BO", "").strip()

    # 1. Direct Ticker Map match
    upper_key = clean_no_eq.upper()
    if f"{upper_key}.NS" in TICKER_MAP.values():
        return f"{upper_key}.NS", clean_no_eq

    # 2. Check curated Alias Map
    lower_name = clean_no_eq.lower()
    if lower_name in ALIAS_MAP:
        return ALIAS_MAP[lower_name], clean_no_eq

    # 3. Fuzzy search in stock directory
    results = search_stocks(clean_no_eq)
    if results:
        best = results[0]
        sym = best["symbol"]
        if not sym.endswith(".NS"):
            sym = f"{sym}.NS"
        return sym, best["name"]

    # Fallback to uppercase symbol
    return f"{upper_key}.NS", clean_no_eq


def detect_broker_format(df_columns: list[str]) -> str:
    cols = [str(c).strip().lower() for c in df_columns]
    cols_str = " ".join(cols)

    if "instrument" in cols and ("avg. cost" in cols_str or "cur. val" in cols_str):
        return "Zerodha"
    if "stock name" in cols and "isin" in cols:
        return "Groww"
    if "scrip" in cols_str or "quantity available" in cols_str:
        return "Upstox"
    if "symbol" in cols and ("buy average" in cols_str or "trade" in cols_str):
        return "AngelOne"
    return "Standard / CSV"


def parse_broker_file(file_bytes: bytes, filename: str) -> dict:
    """
    Parses an uploaded broker statement file (CSV or Excel).
    Returns:
    {
      "broker": "Zerodha",
      "holdings": [
        {
          "original_name": "TATA MOTORS",
          "ticker": "TATAMOTORS.NS",
          "company_name": "Tata Motors Ltd",
          "quantity": 100,
          "avg_buy_price": 750.50
        }
      ],
      "ignored_rows": 0,
      "total_detected": 1
    }
    """
    is_excel = filename.lower().endswith((".xlsx", ".xls"))

    df = None
    if is_excel:
        # Some brokers (e.g. Zerodha) put title / disclaimer lines before header.
        # Try default first; if columns look wrong, look for table header row
        for skip in [0, 1, 2, 3, 4, 5]:
            try:
                temp_df = pd.read_excel(io.BytesIO(file_bytes), skiprows=skip)
                if any(_find_column(list(temp_df.columns), COLUMN_PATTERNS["ticker"]) for _ in [1]):
                    df = temp_df
                    break
            except Exception:
                continue
    else:
        # CSV parsing with flexible encoding (utf-8, cp1252, latin-1)
        for enc in ["utf-8", "cp1252", "latin-1"]:
            for skip in [0, 1, 2, 3, 4, 5]:
                try:
                    temp_df = pd.read_csv(io.BytesIO(file_bytes), skiprows=skip, encoding=enc)
                    if any(_find_column(list(temp_df.columns), COLUMN_PATTERNS["ticker"]) for _ in [1]):
                        df = temp_df
                        break
                except Exception:
                    continue
            if df is not None:
                break

    if df is None or df.empty:
        raise ValueError("Could not parse file. Please upload a valid Zerodha, Groww, AngelOne, Upstox, or standard CSV/Excel holdings statement.")

    # Drop fully empty rows
    df = df.dropna(how="all")

    columns = [str(c).strip() for c in df.columns]
    ticker_col = _find_column(columns, COLUMN_PATTERNS["ticker"])
    qty_col = _find_column(columns, COLUMN_PATTERNS["quantity"])
    price_col = _find_column(columns, COLUMN_PATTERNS["avg_buy_price"])

    if not ticker_col:
        raise ValueError(f"Could not identify a Stock / Ticker / Instrument column in columns: {columns}")
    if not qty_col:
        raise ValueError(f"Could not identify a Quantity column in columns: {columns}")
    if not price_col:
        raise ValueError(f"Could not identify an Average Buy Price column in columns: {columns}")

    broker_detected = detect_broker_format(columns)

    parsed_holdings = []
    ignored_count = 0

    for _, row in df.iterrows():
        raw_ticker = row.get(ticker_col)
        raw_qty = row.get(qty_col)
        raw_price = row.get(price_col)

        if pd.isna(raw_ticker) or str(raw_ticker).strip() == "":
            ignored_count += 1
            continue

        raw_ticker_str = str(raw_ticker).strip()

        # Filter out summary/total rows (e.g. "Total", "Grand Total")
        if re.search(r"^(total|grand\s*total|subtotal)$", raw_ticker_str, re.IGNORECASE):
            continue

        try:
            # Clean numeric strings (remove commas, rupee signs, spaces)
            qty_clean = re.sub(r"[^\d.]", "", str(raw_qty)) if not pd.isna(raw_qty) else "0"
            price_clean = re.sub(r"[^\d.]", "", str(raw_price)) if not pd.isna(raw_price) else "0"

            qty = float(qty_clean)
            price = float(price_clean)

            if qty <= 0:
                ignored_count += 1
                continue

            resolved_ticker, company_name = resolve_stock_symbol(raw_ticker_str)

            parsed_holdings.append({
                "original_name": raw_ticker_str,
                "ticker": resolved_ticker,
                "company_name": company_name,
                "quantity": qty,
                "avg_buy_price": round(price, 2),
            })
        except Exception:
            ignored_count += 1
            continue

    return {
        "broker": broker_detected,
        "holdings": parsed_holdings,
        "total_detected": len(parsed_holdings),
        "ignored_rows": ignored_count,
    }
