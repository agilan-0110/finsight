"""
analytics.py
Portfolio Analytics & Quantitative Health Engine.
Calculates live P&L, per-holding performance, sector exposure, and concentration risk.
Operates 100% locally for $0.00 cost with zero external API fees.
"""

from backend.db.crud import get_portfolio
from backend.db.database import SessionLocal
from backend.data.data_fetch import get_live_price, get_fundamentals


def calculate_portfolio_analytics(db=None) -> dict:
    """
    Computes comprehensive real-time portfolio analytics:
    - Total invested capital vs current market value
    - Unrealized P&L in ₹ and % (total and per-holding)
    - Portfolio weights (%) per stock
    - Sector allocation & distribution
    - Risk flags (single-stock concentration, sector overweight)
    - Diversification score (0-100)
    """
    close_db_after = False
    if db is None:
        db = SessionLocal()
        close_db_after = True

    try:
        holdings = get_portfolio(db)
    finally:
        if close_db_after:
            db.close()

    if not holdings:
        return {
            "total_invested": 0.0,
            "total_current_value": 0.0,
            "total_pnl": 0.0,
            "total_pnl_percentage": 0.0,
            "holdings_count": 0,
            "holdings": [],
            "sectors": {},
            "risk_flags": ["Portfolio is currently empty. Add holdings to track analytics."],
            "diversification_score": 0,
        }

    holdings_data = []
    total_invested = 0.0
    total_current_value = 0.0

    for h in holdings:
        ticker = h.ticker
        qty = float(h.quantity)
        buy_price = float(h.avg_buy_price)
        invested = qty * buy_price
        total_invested += invested

        # Fetch market data
        current_price = buy_price
        sector = "Unclassified"
        pe_ratio = None
        roe = None

        try:
            price_info = get_live_price(ticker)
            val = price_info.get("last_price")
            if isinstance(val, (int, float)):
                current_price = float(val)
        except Exception:
            current_price = buy_price  # fallback to buy price if market data offline

        try:
            fund = get_fundamentals(ticker)
            sector = fund.get("sector") or "Unclassified"
            pe_ratio = fund.get("pe_ratio")
            roe = fund.get("roe")
        except Exception:
            pass

        current_val = qty * current_price
        total_current_value += current_val
        pnl = current_val - invested
        pnl_pct = (pnl / invested * 100) if invested > 0 else 0.0

        holdings_data.append({
            "id": h.id,
            "ticker": ticker,
            "quantity": qty,
            "avg_buy_price": round(buy_price, 2),
            "current_price": round(current_price, 2),
            "invested_value": round(invested, 2),
            "current_value": round(current_val, 2),
            "pnl": round(pnl, 2),
            "pnl_percentage": round(pnl_pct, 2),
            "sector": sector,
            "pe_ratio": pe_ratio,
            "roe": roe,
        })

    total_pnl = total_current_value - total_invested
    total_pnl_pct = (total_pnl / total_invested * 100) if total_invested > 0 else 0.0

    # Calculate portfolio weights & sector allocation
    sectors = {}
    for item in holdings_data:
        weight = (item["current_value"] / total_current_value * 100) if total_current_value > 0 else 0.0
        item["portfolio_weight"] = round(weight, 2)

        sec = item["sector"]
        if sec not in sectors:
            sectors[sec] = {"value": 0.0, "percentage": 0.0, "stocks": []}
        sectors[sec]["value"] += item["current_value"]
        sectors[sec]["stocks"].append(item["ticker"])

    for sec in sectors:
        sec_val = sectors[sec]["value"]
        sectors[sec]["value"] = round(sec_val, 2)
        sectors[sec]["percentage"] = round((sec_val / total_current_value * 100) if total_current_value > 0 else 0.0, 2)

    # Risk Analysis & Concentration Flags
    risk_flags = []
    for item in holdings_data:
        if item["portfolio_weight"] > 25.0:
            risk_flags.append(
                f"Single-stock concentration risk: {item['ticker']} represents {item['portfolio_weight']}% of total portfolio value (recommended max: 20-25%)."
            )

    for sec, sdata in sectors.items():
        if sdata["percentage"] > 40.0:
            risk_flags.append(
                f"Sector overweight risk: '{sec}' represents {sdata['percentage']}% of total portfolio value (recommended max: 30-35%)."
            )

    # Diversification Score (0-100)
    # Based on number of holdings (up to 40 pts) and number of unique sectors (up to 60 pts)
    holdings_pts = min(len(holdings_data) * 8, 40)
    sector_pts = min(len(sectors) * 15, 60)
    diversification_score = holdings_pts + sector_pts

    return {
        "total_invested": round(total_invested, 2),
        "total_current_value": round(total_current_value, 2),
        "total_pnl": round(total_pnl, 2),
        "total_pnl_percentage": round(total_pnl_pct, 2),
        "holdings_count": len(holdings_data),
        "holdings": holdings_data,
        "sectors": sectors,
        "risk_flags": risk_flags,
        "diversification_score": diversification_score,
    }


def format_analytics_for_llm(analytics: dict) -> str:
    """
    Formats the quantitative analytics into a structured, readable block
    ready for injection into FinSight's prompt.
    """
    if analytics.get("holdings_count", 0) == 0:
        return "USER PORTFOLIO ANALYTICS: The user currently has no holdings in their portfolio."

    lines = [
        "USER PORTFOLIO ANALYTICS (REAL-TIME COMPUTED):",
        f"- Total Invested Capital: ₹{analytics['total_invested']:,.2f}",
        f"- Total Current Portfolio Value: ₹{analytics['total_current_value']:,.2f}",
        f"- Net Unrealized P&L: ₹{analytics['total_pnl']:+,.2f} ({analytics['total_pnl_percentage']:+.2f}%)",
        f"- Diversification Score: {analytics['diversification_score']}/100",
        "",
        "HOLDINGS BREAKDOWN:"
    ]

    for h in analytics["holdings"]:
        lines.append(
            f"  - {h['ticker']}: {h['quantity']} shares | Buy Price: ₹{h['avg_buy_price']} | "
            f"Current Price: ₹{h['current_price']} | Weight: {h['portfolio_weight']}% | "
            f"P&L: ₹{h['pnl']:+,.2f} ({h['pnl_percentage']:+.2f}%) | Sector: {h['sector']}"
        )

    lines.append("")
    lines.append("SECTOR EXPOSURE:")
    for sec, data in analytics["sectors"].items():
        lines.append(f"  - {sec}: {data['percentage']}% (₹{data['value']:,.2f}) [{', '.join(data['stocks'])}]")

    if analytics["risk_flags"]:
        lines.append("")
        lines.append("OBSERVED RISK FLAGS:")
        for rf in analytics["risk_flags"]:
            lines.append(f"  - [Risk] {rf}")

    return "\n".join(lines)


if __name__ == "__main__":
    print("Testing portfolio analytics...")
    res = calculate_portfolio_analytics()
    print(format_analytics_for_llm(res))
