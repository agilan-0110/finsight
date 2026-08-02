"""
FinSight — Data Layer (yfinance / NSE)

Three core functions:
    get_live_price(ticker)      -> current price + basic quote info
    get_fundamentals(ticker)    -> P/E, ROE, Debt/Equity, etc.
    get_price_history(ticker)   -> historical OHLC data (for charts later)

NSE tickers need a ".NS" suffix for yfinance (e.g. "TCS" -> "TCS.NS").
All functions accept a plain ticker ("TCS") and add the suffix automatically.
"""

import yfinance as yf
import pandas as pd


def _to_nse_ticker(ticker: str) -> str:
    """Add .NS suffix if not already present (skip for known US tickers/indices)."""
    ticker = ticker.strip().upper()
    if ticker.endswith(".NS") or ticker.startswith("^") or "=" in ticker:
        return ticker
    return f"{ticker}.NS"


def get_live_price(ticker: str) -> dict:
    """
    Returns the current price snapshot for a stock.
    Uses fast_info — much quicker than .info for just price data.
    Raises ValueError if the ticker doesn't resolve to real data
    (bad symbol, typo, or a company name instead of a ticker).
    """
    nse_ticker = _to_nse_ticker(ticker)
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

    return {
        "ticker": nse_ticker,
        "last_price": last_price,
        "previous_close": info.get("previousClose"),
        "day_high": info.get("dayHigh"),
        "day_low": info.get("dayLow"),
        "currency": info.get("currency"),
    }


def get_fundamentals(ticker: str) -> dict:
    """
    Returns key fundamental ratios used later for risk checks and K-Means clustering.
    Uses .info — slower, so call this less frequently than get_live_price.
    """
    nse_ticker = _to_nse_ticker(ticker)
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

    return {
        "ticker": nse_ticker,
        "name": info.get("longName"),
        "sector": info.get("sector"),
        "pe_ratio": info.get("trailingPE"),
        "roe": info.get("returnOnEquity"),
        "debt_to_equity": info.get("debtToEquity"),
        "market_cap": info.get("marketCap"),
    }


def get_price_history(ticker: str, period: str = "3mo", interval: str = "1d") -> pd.DataFrame:
    """
    Returns historical OHLC data as a DataFrame.
    period examples: '1mo', '3mo', '6mo', '1y', '5y'
    interval examples: '1d', '1wk', '1mo'
    """
    nse_ticker = _to_nse_ticker(ticker)
    stock = yf.Ticker(nse_ticker)
    hist = stock.history(period=period, interval=interval)
    hist = hist.reset_index()
    return hist[["Date", "Open", "High", "Low", "Close", "Volume"]]


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

    