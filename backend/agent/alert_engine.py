"""
alert_engine.py
Background Price Alert Engine with 100% Free Telegram Push Notifications.
Monitors active price thresholds and triggers alerts when targets are crossed.
Operates at $0.00 cost using Telegram Bot API & local background scheduling.
"""

import os
import asyncio
import requests
from datetime import datetime, timezone
from dotenv import load_dotenv

from backend.db.crud import get_active_alerts, deactivate_alert
from backend.db.database import SessionLocal
from backend.data.data_fetch import get_live_price

load_dotenv()

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")


def send_telegram_alert(message: str) -> bool:
    """
    Sends an instant push notification to the user's Telegram.
    Uses Telegram Bot API (100% free with unlimited messages).
    """
    token = os.getenv("TELEGRAM_BOT_TOKEN")
    chat_id = os.getenv("TELEGRAM_CHAT_ID")

    if not token or not chat_id:
        print("[Alert Engine] Telegram bot token or chat ID not set in .env. Alert logged to console.")
        return False

    url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": message,
        "parse_mode": "Markdown",
    }

    try:
        res = requests.post(url, json=payload, timeout=5)
        return res.status_code == 200
    except Exception as e:
        print(f"[Alert Engine] Error sending Telegram alert: {e}")
        return False


def check_and_trigger_alerts(db=None) -> list[dict]:
    """
    Evaluates all active price alerts against real-time market data.
    If an alert threshold is breached:
    - Marks alert as inactive in the database (single-shot trigger)
    - Dispatches a push notification via Telegram
    - Logs the event
    """
    close_db_after = False
    if db is None:
        db = SessionLocal()
        close_db_after = True

    triggered = []
    try:
        active_alerts = get_active_alerts(db)
        if not active_alerts:
            return []

        for alert in active_alerts:
            ticker = alert.ticker
            condition = alert.condition.lower()
            threshold = float(alert.threshold)

            try:
                quote = get_live_price(ticker)
                current_price = float(quote.get("last_price", 0.0))
            except Exception as e:
                print(f"[Alert Engine] Could not fetch price for {ticker}: {e}")
                continue

            is_triggered = False
            if condition == "above" and current_price >= threshold:
                is_triggered = True
            elif condition == "below" and current_price <= threshold:
                is_triggered = True

            if is_triggered:
                # 1. Deactivate in DB to prevent duplicate alerts
                deactivate_alert(db, alert.id)

                now_str = datetime.now(timezone.utc).strftime("%d-%b-%Y %H:%M UTC")
                indicator = "🟢" if condition == "above" else "🔴"

                telegram_msg = (
                    f"*FINSIGHT PRICE ALERT*\n"
                    f"━━━━━━━━━━━━━━━━━━━━\n"
                    f"Asset: `{ticker}`\n"
                    f"Condition: {indicator} Crossed *{condition.upper()}* ₹{threshold:,.2f}\n"
                    f"Current Price: *₹{current_price:,.2f}*\n"
                    f"Triggered At: {now_str}\n"
                    f"━━━━━━━━━━━━━━━━━━━━"
                )

                # 2. Dispatch Telegram notification
                sent = send_telegram_alert(telegram_msg)

                print(f"[ALERT TRIGGERED] {ticker} {condition} ₹{threshold} (Current: ₹{current_price}) | Telegram sent: {sent}")

                triggered.append({
                    "id": alert.id,
                    "ticker": ticker,
                    "condition": condition,
                    "threshold": threshold,
                    "current_price": current_price,
                    "telegram_sent": sent,
                    "triggered_at": now_str,
                })
    finally:
        if close_db_after:
            db.close()

    return triggered


from backend.agent.analytics import calculate_portfolio_analytics

_last_weekly_digest_timestamp: float | None = None
WEEKLY_INTERVAL_SECONDS = 7 * 24 * 3600  # 7 days


def generate_portfolio_weekly_digest(db=None) -> str:
    """
    Builds a structured weekly executive summary of the user's portfolio
    with clean, minimal green/red indicators for clear P&L visibility.
    """
    analytics = calculate_portfolio_analytics(db=db)
    now_str = datetime.now(timezone.utc).strftime("%d-%b-%Y")

    if analytics["holdings_count"] == 0:
        return (
            f"*FINSIGHT WEEKLY PORTFOLIO DIGEST* ({now_str})\n"
            f"━━━━━━━━━━━━━━━━━━━━\n"
            f"Status: No active holdings currently registered in portfolio."
        )

    pnl_indicator = "🟢 Net Profit" if analytics["total_pnl"] >= 0 else "🔴 Net Loss"

    lines = [
        f"*FINSIGHT WEEKLY PORTFOLIO DIGEST* ({now_str})",
        "━━━━━━━━━━━━━━━━━━━━",
        f"Total Current Value: ₹{analytics['total_current_value']:,.2f}",
        f"Total Invested Capital: ₹{analytics['total_invested']:,.2f}",
        f"{pnl_indicator}: *₹{analytics['total_pnl']:+,.2f}* (*{analytics['total_pnl_percentage']:+.2f}%*)",
        f"Diversification Score: {analytics['diversification_score']}/100",
        "",
        "*HOLDINGS BREAKDOWN:*"
    ]

    for h in analytics["holdings"]:
        h_tag = "🟢" if h["pnl"] >= 0 else "🔴"
        lines.append(
            f"- {h_tag} `{h['ticker']}`: {h['quantity']} shares | Current: ₹{h['current_value']:,.2f} ({h['portfolio_weight']}%) | P&L: ₹{h['pnl']:+,.2f} ({h['pnl_percentage']:+.2f}%)"
        )

    lines.append("")
    lines.append("*SECTOR ALLOCATION:*")
    for sec, sdata in list(analytics["sectors"].items())[:3]:
        lines.append(f"- {sec}: {sdata['percentage']}% (₹{sdata['value']:,.2f})")

    if analytics["risk_flags"]:
        lines.append("")
        lines.append("*RISK OBSERVATIONS:*")
        for rf in analytics["risk_flags"][:2]:
            lines.append(f"- ⚠️ {rf}")

    lines.append("━━━━━━━━━━━━━━━━━━━━")
    return "\n".join(lines)


def send_weekly_digest_now(db=None) -> dict:
    """
    Generates and dispatches the weekly portfolio digest to Telegram immediately.
    """
    digest_text = generate_portfolio_weekly_digest(db=db)
    sent = send_telegram_alert(digest_text)
    return {
        "sent_to_telegram": sent,
        "digest": digest_text,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }


async def alert_background_worker(interval_seconds: int = 60):
    """
    Async background task that runs continuously during FastAPI server lifespan.
    Checks active price alerts every interval_seconds, and checks weekly digest schedule.
    """
    global _last_weekly_digest_timestamp
    print(f"[Alert Engine] Background monitor started (price checks: {interval_seconds}s, weekly digest: active)...")

    while True:
        try:
            # 1. Evaluate price threshold alerts
            check_and_trigger_alerts()

            # 2. Check weekly digest schedule (every 7 days)
            now = datetime.now(timezone.utc).timestamp()
            if _last_weekly_digest_timestamp is None:
                _last_weekly_digest_timestamp = now  # Initialize on server boot
            elif now - _last_weekly_digest_timestamp >= WEEKLY_INTERVAL_SECONDS:
                print("[Alert Engine] Dispatching scheduled weekly portfolio digest...")
                send_weekly_digest_now()
                _last_weekly_digest_timestamp = now
        except Exception as e:
            print(f"[Alert Engine] Worker error: {e}")
        await asyncio.sleep(interval_seconds)


if __name__ == "__main__":
    print("Testing check_and_trigger_alerts directly...")
    res = check_and_trigger_alerts()
    print("Triggered alerts:", res)
    print("\nTesting weekly digest generation:")
    print(generate_portfolio_weekly_digest())
