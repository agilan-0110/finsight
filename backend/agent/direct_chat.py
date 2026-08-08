"""
direct_chat.py
Phase 3 — Direct Context Injection.

This is the orchestration layer between the user's chat message and Groq.
It decides whether portfolio context is needed, pulls live market data for
relevant holdings, builds a single grounded prompt, and calls groq_client.

NOTE: adjust the imports below to match your actual module paths/function
names for portfolio CRUD and data_fetch — these are written to match what's
described in your project so far, but double check against your real files.
"""

from backend.agent.groq_client import ask_groq, FINSIGHT_SYSTEM_PROMPT
from backend.data.data_fetch import get_live_price, get_fundamentals
from backend.db.crud import get_portfolio
from backend.db.database import SessionLocal  # adjust if your session factory lives elsewhere


# Keywords that suggest the user is asking about THEIR portfolio,
# not just general market questions.
PORTFOLIO_KEYWORDS = [
    "my portfolio", "my holdings", "my stocks", "i own",
    "rebalance", "diversif", "concentration", "my investment",
    "my positions", "how am i doing"
]


def needs_portfolio_context(user_message: str) -> bool:
    """
    Cheap keyword check to decide if we should spend tokens pulling
    portfolio + live data into the prompt. Not perfect, but good enough
    for Phase 3 — a real intent classifier is a later-phase upgrade, not
    a Phase 3 requirement.
    """
    message_lower = user_message.lower()
    return any(keyword in message_lower for keyword in PORTFOLIO_KEYWORDS)


def build_portfolio_context() -> str:
    """
    Fetches the user's holdings from the DB, then pulls live price +
    fundamentals for each ticker, and formats it into a readable block
    the LLM can reason over.

    This app is single-user (get_portfolio() returns ALL holdings —
    no user filtering), so no user_id is needed anywhere in this flow.

    Returns a plain-text block, NOT raw JSON — LLMs reason better over
    labeled, structured text than over dumped JSON.
    """
    db = SessionLocal()
    try:
        holdings = get_portfolio(db)
    finally:
        db.close()

    if not holdings:
        return "The user currently has no holdings in their portfolio."

    context_lines = ["USER'S CURRENT PORTFOLIO:"]

    for holding in holdings:
        ticker = holding.ticker
        quantity = holding.quantity
        avg_buy_price = holding.avg_buy_price

        try:
            price_data = get_live_price(ticker)
            fundamentals = get_fundamentals(ticker)

            current_price = price_data.get("last_price", "N/A")
            pe_ratio = fundamentals.get("pe_ratio", "N/A")
            sector = fundamentals.get("sector", "N/A")

            context_lines.append(
                f"- {ticker}: {quantity} shares | Avg buy price: ₹{avg_buy_price} "
                f"| Current price: ₹{current_price} | P/E: {pe_ratio} | Sector: {sector}"
            )
        except Exception as e:
            # If one ticker fails (bad data, rate limit, etc.), don't kill
            # the whole context block — just note it's missing.
            context_lines.append(f"- {ticker}: {quantity} shares | Live data unavailable ({str(e)})")

    return "\n".join(context_lines)


def get_chat_response(user_message: str) -> str:
    """
    Main entry point — this is what the /chat endpoint will call.

    Args:
        user_message: The raw message the user typed.

    Returns:
        FinSight's text response.
    """
    context_block = ""

    if needs_portfolio_context(user_message):
        context_block = build_portfolio_context()

    if context_block:
        full_prompt = (
            f"{context_block}\n\n"
            f"USER QUESTION: {user_message}\n\n"
            f"Answer using the portfolio data above where relevant. "
            f"If the question needs data not shown above, say so instead of guessing."
        )
    else:
        # No portfolio context needed — just pass the question through
        full_prompt = user_message

    return ask_groq(prompt=full_prompt, system_prompt=FINSIGHT_SYSTEM_PROMPT)


if __name__ == "__main__":
    print("--- Generic question (no portfolio pulled) ---")
    print(get_chat_response("What does a P/E ratio mean?"))

    print("\n--- Portfolio question (should pull holdings + live data) ---")
    print(get_chat_response("How diversified is my portfolio?"))