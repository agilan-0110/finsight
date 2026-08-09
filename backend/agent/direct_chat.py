"""
direct_chat.py
Phase 3 — Direct Context Injection.
Phase 4 — RAG news context + dynamic ticker resolution added.
"""

import yfinance as yf

from backend.agent.groq_client import ask_groq, FINSIGHT_SYSTEM_PROMPT
from backend.agent.retrieval import retrieve_relevant_news
from backend.agent.alias_map import ALIAS_MAP
from backend.agent.ticker_map import TICKER_MAP
from backend.data.data_fetch import get_live_price, get_fundamentals
from backend.db.crud import get_portfolio
from backend.db.database import SessionLocal


PORTFOLIO_KEYWORDS = [
    "my portfolio", "my holdings", "my stocks", "i own",
    "rebalance", "diversif", "concentration", "my investment",
    "my positions", "how am i doing"
]

NEWS_KEYWORDS = [
    "news", "sentiment", "opinion", "headline", "buzz",
    "recent development", "what's happening", "market talk"
]

# Simple in-memory cache so repeated questions about the same company
# don't trigger a fresh API call every time within a session
_ticker_lookup_cache: dict[str, str | None] = {}


def needs_portfolio_context(user_message: str) -> bool:
    message_lower = user_message.lower()
    return any(keyword in message_lower for keyword in PORTFOLIO_KEYWORDS)


def needs_news_context(user_message: str) -> bool:
    message_lower = user_message.lower()
    return any(keyword in message_lower for keyword in NEWS_KEYWORDS)


def lookup_ticker_dynamic(query_text: str) -> str | None:
    """
    Falls back to Yahoo Finance's search API when the name isn't found
    in the portfolio or the static map. Restricts to NSE (.NS) results
    since FinSight is scoped to Indian equities.
    """
    if query_text in _ticker_lookup_cache:
        return _ticker_lookup_cache[query_text]

    ticker = None
    try:
        search = yf.Search(query_text, max_results=5)
        quotes = search.quotes  # list of dicts with 'symbol', 'shortname', etc.

        for quote in quotes:
            symbol = quote.get("symbol", "")
            if symbol.endswith(".NS"):
                ticker = symbol
                break  # take the first NSE match
    except Exception:
        ticker = None  # network hiccup, bad query, etc. — fail gracefully

    _ticker_lookup_cache[query_text] = ticker
    return ticker


# Common words that shouldn't count as a meaningful company-name match
STOPWORDS = {"the", "and", "of", "a", "an", "ltd", "limited", "co", "company", "india"}


def extract_ticker_from_message(user_message: str) -> str | None:
    """
    Four-tier ticker detection, most-precise/cheapest first:
    1. User's own portfolio holdings
    2. Curated ALIAS_MAP (short, common names — unambiguous by design)
    3. Auto-generated TICKER_MAP (Nifty 500 official names) —
       full-name substring match ONLY, no single-word matching,
       since official names are too ambiguous for that
    4. Dynamic Yahoo search (last resort)
    """
    message_lower = user_message.lower()

    # Tier 1: portfolio holdings
    db = SessionLocal()
    try:
        holdings = get_portfolio(db)
    finally:
        db.close()

    for holding in holdings:
        ticker = holding.ticker
        base_name = ticker.replace(".NS", "").lower()
        if base_name in message_lower:
            return ticker

    # Tier 2: curated aliases — check both directions since these are short and precise
    for name in sorted(ALIAS_MAP.keys(), key=len, reverse=True):
        if name in message_lower:
            return ALIAS_MAP[name]

    # Tier 3: auto-generated official names — full phrase match only
    # (no first-word matching here; too many companies share first words)
    for name in sorted(TICKER_MAP.keys(), key=len, reverse=True):
        if name in message_lower:
            return TICKER_MAP[name]

    # Tier 4: dynamic lookup via Yahoo search
    dynamic_result = lookup_ticker_dynamic(user_message)
    if dynamic_result:
        return dynamic_result

    return None

def build_portfolio_context() -> str:
    """
    Fetches the user's holdings from the DB, pulls live price + fundamentals
    for each ticker, and formats it into a readable block for the LLM.
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
            context_lines.append(f"- {ticker}: {quantity} shares | Live data unavailable ({str(e)})")

    return "\n".join(context_lines)


def build_news_context(user_message: str) -> str:
    """
    Retrieves relevant news chunks (filtered to a ticker if one is detected
    in the message) and formats them into a labeled, LLM-readable block.
    """
    ticker = extract_ticker_from_message(user_message)
    results = retrieve_relevant_news(query=user_message, ticker=ticker, top_k=3)

    if not results:
        return "No relevant recent news found."

    context_lines = ["RELEVANT RECENT NEWS:"]
    for r in results:
        context_lines.append(f"- ({r['title']}) {r['text'][:400]}...")

    return "\n".join(context_lines)


def get_chat_response(user_message: str) -> str:
    """
    Main entry point — this is what the /chat endpoint calls.
    """
    context_blocks = []

    if needs_portfolio_context(user_message):
        context_blocks.append(build_portfolio_context())

    if needs_news_context(user_message):
        context_blocks.append(build_news_context(user_message))

    if context_blocks:
        combined_context = "\n\n".join(context_blocks)
        full_prompt = (
            f"{combined_context}\n\n"
            f"USER QUESTION: {user_message}\n\n"
            f"Answer using the data above where relevant. "
            f"If the question needs data not shown above, say so instead of guessing. "
            f"If using news, treat it as informational signal only — never convert it into a buy/sell recommendation."
        )
    else:
        full_prompt = user_message

    return ask_groq(prompt=full_prompt, system_prompt=FINSIGHT_SYSTEM_PROMPT)


if __name__ == "__main__":
    print("--- Generic question ---")
    print(get_chat_response("What does a P/E ratio mean?"))

    print("\n--- Portfolio question ---")
    print(get_chat_response("How diversified is my portfolio?"))

    print("\n--- News/sentiment question (in portfolio) ---")
    print(get_chat_response("What's the recent news sentiment on Reliance?"))

    print("\n--- Dynamic ticker lookup test (not in portfolio/map) ---")
    print("Resolved ticker:", extract_ticker_from_message("what's the news on Zomato?"))