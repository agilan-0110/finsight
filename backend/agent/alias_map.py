"""
Curated short-name aliases for commonly-referenced stocks.
Checked BEFORE the auto-generated TICKER_MAP (ticker_map.py) because
official NSE names are ambiguous when matched by first word alone
(e.g. "hdfc" alone could mean HDFC Bank, HDFC AMC, HDFC Life, etc.)
This list is intentionally small and precise — extend as needed.
"""

ALIAS_MAP = {
    "reliance": "RELIANCE.NS",
    "tcs": "TCS.NS",
    "tata consultancy": "TCS.NS",
    "infosys": "INFY.NS",
    "hdfc bank": "HDFCBANK.NS",
    "icici bank": "ICICIBANK.NS",
    "sbi": "SBIN.NS",
    "state bank": "SBIN.NS",
    "bharti airtel": "BHARTIARTL.NS",
    "airtel": "BHARTIARTL.NS",
    "itc": "ITC.NS",
    "hindustan unilever": "HINDUNILVR.NS",
    "hul": "HINDUNILVR.NS",
    "larsen": "LT.NS",
    "l&t": "LT.NS",
    "kotak": "KOTAKBANK.NS",
    "axis bank": "AXISBANK.NS",
    "maruti": "MARUTI.NS",
    "asian paints": "ASIANPAINT.NS",
    "wipro": "WIPRO.NS",
    "adani enterprises": "ADANIENT.NS",
    "tata motors": "TATAMOTORS.NS",
    "bajaj finance": "BAJFINANCE.NS",
    "sun pharma": "SUNPHARMA.NS",
    "zomato": "ETERNAL.NS",
}