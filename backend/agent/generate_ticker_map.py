"""
Builds ticker_map.py from NSE's official Nifty 500 constituent CSV.
Static file download — no session/cookie dance needed, just proper headers.
"""

import requests
import csv
import io

NIFTY500_CSV_URL = "https://archives.nseindia.com/content/indices/ind_nifty500list.csv"

# NSE blocks bare requests; mimicking a real browser gets through more reliably
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                  "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/csv,application/csv,text/plain,*/*",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://www.nseindia.com/",
}


def fetch_nifty500() -> list[dict]:
    response = requests.get(NIFTY500_CSV_URL, headers=HEADERS, timeout=10)
    response.raise_for_status()
    print(f"Status: {response.status_code} | Content length: {len(response.text)}")
    print("First 300 chars of response:\n", response.text[:300])

    csv_data = csv.DictReader(io.StringIO(response.text))
    return list(csv_data)


def build_ticker_map(rows: list[dict]) -> dict:
    ticker_map = {}
    for row in rows:
        company_name = row.get("Company Name", "").strip()
        symbol = row.get("Symbol", "").strip()
        if company_name and symbol:
            ticker_map[company_name.lower()] = f"{symbol}.NS"
    return ticker_map


def write_ticker_map_file(ticker_map: dict, output_path: str = "backend/agent/ticker_map.py"):
    with open(output_path, "w", encoding="utf-8") as f:
        f.write('"""\n')
        f.write("Company name -> NSE ticker lookup.\n")
        f.write("Auto-generated from NSE's official Nifty 500 CSV via generate_ticker_map.py.\n")
        f.write('"""\n\n')
        f.write("TICKER_MAP = {\n")
        for name, ticker in sorted(ticker_map.items()):
            safe_name = name.replace('"', '\\"')
            f.write(f'    "{safe_name}": "{ticker}",\n')
        f.write("}\n")

    print(f"Wrote {len(ticker_map)} entries to {output_path}")


if __name__ == "__main__":
    rows = fetch_nifty500()
    print(f"\nParsed {len(rows)} rows from CSV")
    if rows:
        print("First row:", rows[0])
    ticker_map = build_ticker_map(rows)
    write_ticker_map_file(ticker_map)