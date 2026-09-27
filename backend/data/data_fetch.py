"""
FinSight — Data Layer (yfinance / NSE)

Three core functions:
    get_live_price(ticker)      -> current price + basic quote info
    get_fundamentals(ticker)    -> P/E, ROE, Debt/Equity, etc.
    get_price_history(ticker)   -> historical OHLC data (for charts later)

NSE tickers need a ".NS" suffix for yfinance (e.g. "TCS" -> "TCS.NS").
All functions accept a plain ticker ("TCS") and add the suffix automatically.
"""

import time
import yfinance as yf
import pandas as pd
from backend.data.stock_directory import search_local_stocks, resolve_symbol_or_name

# In-memory search query cache: {query: (timestamp, results)}
_search_cache: dict[str, tuple[float, list[dict]]] = {}
SEARCH_CACHE_TTL = 300.0  # 5 minutes


def _to_nse_ticker(ticker: str) -> str:
    """Add .NS suffix if not already present, resolving plain company names if needed."""
    raw = ticker.strip()
    # Check if raw input is a company name like 'Tata Motors' or 'state bank'
    resolved = resolve_symbol_or_name(raw)
    clean_sym = (resolved or raw).upper().replace(".NS", "")
    if clean_sym.startswith("^") or "=" in clean_sym:
        return clean_sym
    return f"{clean_sym}.NS"


def search_stocks(query: str, limit: int = 8) -> list[dict]:
    """
    Search Indian stocks by company name, brand name, ticker symbol, or keywords.
    Combines local curated directory with live Yahoo Finance search fallback.
    """
    q = query.strip()
    if not q:
        return []

    cache_key = q.lower()
    now = time.time()
    if cache_key in _search_cache:
        ts, cached_res = _search_cache[cache_key]
        if now - ts < SEARCH_CACHE_TTL:
            return cached_res

    # 1. Local curated directory (instant, precise)
    results = search_local_stocks(q, limit=limit)
    existing_symbols = {r["symbol"] for r in results}

    # 2. Live yfinance search fallback if more results needed
    if len(results) < limit:
        try:
            s = yf.Search(q, max_results=6)
            for item in s.quotes:
                sym = item.get("symbol", "")
                if sym.endswith(".NS") or item.get("exchange") in ["NSI", "BSE"]:
                    clean_sym = sym.replace(".NS", "").replace(".BO", "")
                    if clean_sym not in existing_symbols:
                        name = item.get("longname") or item.get("shortname") or clean_sym
                        results.append({
                            "symbol": clean_sym,
                            "name": name,
                            "sector": item.get("sector", "NSE Equity"),
                            "exchange": "NSE"
                        })
                        existing_symbols.add(clean_sym)
                        if len(results) >= limit:
                            break
        except Exception:
            pass

    _search_cache[cache_key] = (now, results[:limit])
    return results[:limit]


# In-memory TTL cache: {ticker: (timestamp, data)}
_price_cache: dict[str, tuple[float, dict]] = {}
_fundamentals_cache: dict[str, tuple[float, dict]] = {}
CACHE_TTL = 60.0  # seconds


def get_live_price(ticker: str) -> dict:
    """
    Returns the current price snapshot for a stock.
    Uses in-memory 60s TTL cache to avoid redundant network calls.
    """
    nse_ticker = _to_nse_ticker(ticker)
    now = time.time()

    if nse_ticker in _price_cache:
        ts, cached_data = _price_cache[nse_ticker]
        if now - ts < CACHE_TTL:
            return cached_data

    stock = yf.Ticker(nse_ticker)

    try:
        info = stock.fast_info
        last_price = info.get("lastPrice")
    except Exception:
        last_price = None

    if last_price is None:
        raise ValueError(
            f"Could not find data for '{ticker}' (tried '{nse_ticker}'). "
            f"Check the ticker symbol is correct — company names won't work, "
            f"only exact NSE symbols like 'TCS' or 'TATACOMM'."
        )

    res = {
        "ticker": nse_ticker,
        "last_price": last_price,
        "previous_close": info.get("previousClose"),
        "day_high": info.get("dayHigh"),
        "day_low": info.get("dayLow"),
        "currency": info.get("currency"),
    }
    _price_cache[nse_ticker] = (now, res)
    return res


def get_fundamentals(ticker: str) -> dict:
    """
    Returns key fundamental ratios used later for risk checks and K-Means clustering.
    Uses in-memory 60s TTL cache.
    """
    nse_ticker = _to_nse_ticker(ticker)
    now = time.time()

    if nse_ticker in _fundamentals_cache:
        ts, cached_data = _fundamentals_cache[nse_ticker]
        if now - ts < CACHE_TTL:
            return cached_data

    stock = yf.Ticker(nse_ticker)

    try:
        info = stock.info
        name = info.get("longName")
    except Exception:
        info, name = {}, None

    if not name:
        raise ValueError(
            f"Could not find fundamentals for '{ticker}' (tried '{nse_ticker}'). "
            f"Check the ticker symbol is correct — company names won't work, "
            f"only exact NSE symbols like 'TCS' or 'TATACOMM'."
        )

    res = {
        "ticker": nse_ticker,
        "name": info.get("longName"),
        "sector": info.get("sector"),
        "pe_ratio": info.get("trailingPE"),
        "roe": info.get("returnOnEquity"),
        "debt_to_equity": info.get("debtToEquity"),
        "market_cap": info.get("marketCap"),
    }
    _fundamentals_cache[nse_ticker] = (now, res)
    return res


def get_price_history(ticker: str, period: str = "3mo", interval: str = "1d") -> pd.DataFrame:
    """
    Returns historical OHLC data as a DataFrame.
    period examples: '1mo', '3mo', '6mo', '1y', '5y'
    interval examples: '1d', '1wk', '1mo'
    """
    nse_ticker = _to_nse_ticker(ticker)
    stock = yf.Ticker(nse_ticker)
    hist = stock.history(period=period, interval=interval)
    if hist.empty:
        raise ValueError(
            f"Could not find price history for '{ticker}' (tried '{nse_ticker}'). "
            f"Check the ticker symbol is correct — company names won't work, "
            f"only exact NSE symbols like 'TCS' or 'TATACOMM'."
        )
    hist = hist.reset_index()
    cols = [col for col in ["Date", "Open", "High", "Low", "Close", "Volume"] if col in hist.columns]
    return hist[cols]


if __name__ == "__main__":
    # Quick smoke test — run this file directly to sanity-check all three functions
    test_ticker = "ITC"

    print("=== Live Price ===")
    print(get_live_price(test_ticker))

    print("\n=== Fundamentals ===")
    print(get_fundamentals(test_ticker))

    print("\n=== Price History (last 5 rows) ===")
    print(get_price_history(test_ticker).tail())

    print("\n=== Bad Ticker Test (should raise a clear error, not silent Nones) ===")
    try:
        get_live_price("Tata Communications")  # company name, not a symbol — should fail
    except ValueError as e:
        print(f"Caught expected error: {e}")

    