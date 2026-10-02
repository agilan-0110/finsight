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
from backend.db.crud import (
    get_portfolio,
    get_recent_messages,
    add_message,
    get_user_by_id,
    get_user_profile,
    get_user_goals,
)
from backend.db.database import SessionLocal
from backend.agent.ingest_news import ingest_news_for_ticker
from backend.agent.sentiment import attach_sentiment
from backend.agent.memory_store import (
    retrieve_relevant_memories,
    add_user_memory,
    get_all_memories,
)

PORTFOLIO_KEYWORDS = [
    "my portfolio", "my holdings", "my stocks", "i own",
    "rebalance", "diversif", "concentration", "my investment",
    "my positions", "how am i doing",
    "p&l", "profit and loss", "my gain", "my loss", "am i up", "am i down",
    "my return", "how much have i made", "my performance",
    "sector exposure", "too exposed", "overexposed", "am i exposed",
    "my allocation", "asset allocation"
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


import re

QUESTION_FILLERS = {
    "what", "is", "the", "price", "of", "tell", "me", "about", "how", "are",
    "news", "on", "for", "in", "latest", "today", "recent", "sentiment", "stock",
    "share", "shares", "company", "pe", "p/e", "ratio", "and", "or", "to", "a", "an",
    "good", "buy", "doing", "looking", "at", "with", "happening", "check", "current"
}


def _extract_query_candidates(text: str) -> list[str]:
    """
    Extracts potential company names/tickers from a freeform user question
    by stripping out common conversational filler and question words.
    """
    clean = re.sub(r"[^a-zA-Z0-9\s]", " ", text)
    words = [w for w in clean.split() if w.lower() not in QUESTION_FILLERS and len(w) > 1]
    candidates = []
    if len(words) >= 2:
        candidates.append(" ".join(words))
    candidates.extend(words)
    return candidates


def lookup_ticker_dynamic(query_text: str) -> str | None:
    """
    Falls back to Yahoo Finance's search API when the name isn't found
    in the portfolio or the static map. Restricts to NSE (.NS) results
    since FinSight is scoped to Indian equities.
    """
    if query_text in _ticker_lookup_cache:
        return _ticker_lookup_cache[query_text]

    candidates = _extract_query_candidates(query_text)
    if not candidates:
        candidates = [query_text.strip()]

    ticker = None
    for cand in candidates:
        try:
            search = yf.Search(cand, max_results=5)
            quotes = search.quotes
            for quote in quotes:
                symbol = quote.get("symbol", "")
                if symbol.endswith(".NS"):
                    ticker = symbol
                    break
            if ticker:
                break
        except Exception:
            continue

    _ticker_lookup_cache[query_text] = ticker
    return ticker


# Common words that shouldn't count as a meaningful company-name match
STOPWORDS = {"the", "and", "of", "a", "an", "ltd", "limited", "co", "company", "india"}


def extract_ticker_from_message(user_message: str) -> str | None:
    """
    Five-tier ticker detection, most-precise/cheapest first:
    0. Direct .NS ticker in message (e.g. TCS.NS, RELIANCE.NS)
    1. User's own portfolio holdings
    2. Curated ALIAS_MAP (short, common names with word boundary matching)
    3. Auto-generated TICKER_MAP (Nifty 500 official names)
    4. Dynamic Yahoo search with candidate filtering
    """
    # Tier 0: Direct .NS ticker pattern in message
    direct_ns = re.findall(r"\b([A-Za-z0-9\-]+)\.NS\b", user_message, re.IGNORECASE)
    if direct_ns:
        return f"{direct_ns[0].upper()}.NS"

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
        if re.search(r"\b" + re.escape(base_name) + r"\b", message_lower):
            return ticker

    # Tier 2: curated aliases — check word boundaries
    for name in sorted(ALIAS_MAP.keys(), key=len, reverse=True):
        if re.search(r"\b" + re.escape(name) + r"\b", message_lower):
            return ALIAS_MAP[name]

    # Tier 3: auto-generated official names — full phrase match
    for name in sorted(TICKER_MAP.keys(), key=len, reverse=True):
        if re.search(r"\b" + re.escape(name) + r"\b", message_lower):
            return TICKER_MAP[name]

    # Tier 4: dynamic lookup via Yahoo search on extracted candidates
    dynamic_result = lookup_ticker_dynamic(user_message)
    if dynamic_result:
        return dynamic_result

    return None

from backend.agent.analytics import calculate_portfolio_analytics, format_analytics_for_llm


def build_portfolio_context(user_id: int | None = None) -> str:
    """
    Computes real-time portfolio analytics (invested vs current, P&L in ₹ and %,
    sector weights, and concentration risk flags) and formats it for the LLM.
    """
    analytics = calculate_portfolio_analytics(user_id=user_id)
    return format_analytics_for_llm(analytics)


def build_news_context(user_message: str) -> str:
    """
    Retrieves relevant news chunks for the detected ticker, classifies each
    chunk's sentiment (FinBERT), and formats it for the LLM.
    If nothing's been ingested for that ticker yet, triggers ingestion
    on the spot (auto-ingest on demand) and retries once before giving up.
    """
    ticker = extract_ticker_from_message(user_message)
    results = retrieve_relevant_news(query=user_message, ticker=ticker, top_k=3)

    if not results and ticker:
        # Nothing found for this specific ticker — likely never ingested.
        # Ingest now, then retry the same query once.
        ingested_count = ingest_news_for_ticker(ticker)
        if ingested_count > 0:
            results = retrieve_relevant_news(query=user_message, ticker=ticker, top_k=3)

    if not results:
        return "No relevant recent news found."

    results = attach_sentiment(results)

    context_lines = ["RELEVANT RECENT NEWS:"]
    for r in results:
        sentiment = r["sentiment"]
        context_lines.append(
            f"- [{sentiment['label'].upper()} | confidence {sentiment['confidence']}] "
            f"({r['title']}) {r['text'][:400]}..."
        )

    return "\n".join(context_lines)

def build_stock_context(ticker: str) -> str:
    """
    Fetches real-time price snapshot and fundamentals for an individual stock.
    Injected when a user asks about a specific stock that isn't already covered
    by the portfolio context.
    """
    lines = [f"MARKET DATA FOR {ticker}:"]
    try:
        price_data = get_live_price(ticker)
        current_price = round(price_data.get("last_price", "N/A"), 2) if isinstance(price_data.get("last_price"), (int, float)) else "N/A"
        day_high = price_data.get("day_high", "N/A")
        day_low = price_data.get("day_low", "N/A")
        prev_close = price_data.get("previous_close", "N/A")
        lines.append(f"- Current Price: ₹{current_price} | Prev Close: ₹{prev_close} | Day Range: ₹{day_low} - ₹{day_high}")
    except Exception as e:
        lines.append(f"- Live price unavailable: {str(e)}")

    try:
        fundamentals = get_fundamentals(ticker)
        name = fundamentals.get("name", ticker)
        sector = fundamentals.get("sector", "N/A")
        pe_ratio = fundamentals.get("pe_ratio", "N/A")
        roe = fundamentals.get("roe", "N/A")
        debt_to_equity = fundamentals.get("debt_to_equity", "N/A")
        market_cap = fundamentals.get("market_cap", "N/A")
        lines.append(f"- Company: {name} | Sector: {sector}")
        lines.append(f"- P/E Ratio: {pe_ratio} | ROE: {roe} | Debt-to-Equity: {debt_to_equity} | Market Cap: {market_cap}")
    except Exception as e:
        lines.append(f"- Fundamentals unavailable: {str(e)}")

    return "\n".join(lines)


def build_user_memory_dossier(user_id: int | None = None, user_message: str = "") -> str:
    """
    Builds a comprehensive ChatGPT & Gemini-style persistent user memory dossier.
    Includes identity, financial profile, goals, active portfolio snapshot,
    and long-term learned facts.
    """
    lines = ["=== USER MEMORY & DOSSIER (WHAT YOU PERMANENTLY KNOW ABOUT THIS USER) ==="]

    if user_id is not None:
        db = SessionLocal()
        try:
            user = get_user_by_id(db, user_id)
            if user:
                lines.append(f"- User Name: {user.full_name}")
                if user.primary_broker and user.primary_broker != "generic":
                    lines.append(f"- Primary Broker: {user.primary_broker.upper()}")

            profile = get_user_profile(db, user_id)
            if profile and profile.onboarding_completed:
                goal_labels = {
                    "wealth": "Long-term wealth accumulation",
                    "retirement": "Retirement freedom",
                    "education": "Higher education funding",
                    "purchase": "Major life purchase",
                    "income": "Regular dividend & interest income",
                    "safety": "Capital protection & beating inflation",
                    "unsure": "Exploring investment options",
                }
                exp_labels = {
                    "completely_new": "Complete beginner (needs gentle concepts & simple everyday analogies)",
                    "know_basics": "Knows fundamentals (understands stocks vs funds, wants valuation & risk guidance)",
                    "already_invest": "Experienced investor (wants deep quantitative analytics)",
                }
                risk_labels = {
                    "sell": "Conservative / Risk-averse (uncomfortable with market dips)",
                    "wait_understand": "Moderate risk tolerance (prefers to hold and understand fluctuations)",
                    "fluctuate_comfortable": "Growth-oriented / High risk tolerance (comfortable with volatility)",
                }
                lines.append(f"- Experience Level: {exp_labels.get(profile.experience_level, profile.experience_level)}")
                lines.append(f"- Primary Financial Goal: {goal_labels.get(profile.primary_goal, profile.primary_goal)}")
                lines.append(f"- Investment Time Horizon: {profile.time_horizon}")
                lines.append(f"- Monthly Investable Capacity: ₹{profile.monthly_investment:,.0f}/month")
                lines.append(f"- Behavioral Risk Profile: {risk_labels.get(profile.risk_reaction, profile.risk_reaction)}")

            goals = get_user_goals(db, user_id)
            if goals:
                goal_items = [
                    f"'{g.title}' (Target: ₹{g.target_amount:,.0f} in {g.target_years} yrs, Monthly SIP ~₹{g.monthly_contribution:,.0f})"
                    for g in goals
                ]
                lines.append(f"- Active Financial Goals: {'; '.join(goal_items)}")

            holdings = get_portfolio(db, user_id)
            if holdings:
                tickers = [h.ticker.replace('.NS', '') for h in holdings]
                lines.append(f"- Current Portfolio: Holds {len(holdings)} positions ({', '.join(tickers[:6])})")
        except Exception as e:
            print(f"Error building profile dossier: {e}")
        finally:
            db.close()

    # ChromaDB Long-Term Learned Memories (like ChatGPT memory bank)
    try:
        all_mems = get_all_memories(user_id=user_id)
        if all_mems:
            lines.append("- Stored Memories & Personal Facts:")
            for m in all_mems[-6:]:
                lines.append(f"  • {m['memory']}")
    except Exception as e:
        print(f"Error fetching memories: {e}")

    lines.append("=== END USER DOSSIER ===")
    return "\n".join(lines)


def get_chat_response(
    user_message: str,
    max_history_turns: int = 0,
    user_id: int | None = None,
    return_remembered: bool = False,
) -> str | tuple[str, list[str]]:
    """
    Main entry point — this is what the /chat endpoint calls.
    Knows all details about the user via the Memory Dossier, while keeping
    each question's topic independent.
    """
    # By default, do not inject past conversation turns to avoid topic mixing
    history_payload = []

    context_blocks = []

    # 1. ALWAYS inject the User Memory Dossier (ChatGPT/Gemini style permanent memory)
    user_dossier = build_user_memory_dossier(user_id=user_id, user_message=user_message)
    context_blocks.append(user_dossier)

    # 2. Only extract ticker if explicitly present in the CURRENT message
    ticker = extract_ticker_from_message(user_message)

    portfolio_needed = needs_portfolio_context(user_message)

    if portfolio_needed:
        context_blocks.append(build_portfolio_context(user_id=user_id))
    elif ticker:
        context_blocks.append(build_stock_context(ticker))

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

    response = ask_groq(
        prompt=full_prompt,
        system_prompt=FINSIGHT_SYSTEM_PROMPT,
        chat_history=history_payload,
    )

    # Extract any single-pass Gemini-style [REMEMBER: ...] tags
    remember_matches = re.findall(r"\[REMEMBER:\s*(.*?)\]", response, re.IGNORECASE)
    new_memories: list[str] = []
    for fact in remember_matches:
        cleaned_fact = fact.strip()
        if cleaned_fact:
            try:
                add_user_memory(cleaned_fact, user_id=user_id)
                new_memories.append(cleaned_fact)
            except Exception:
                pass

    # Strip the [REMEMBER: ...] tag so the user receives a clean response
    clean_response = re.sub(r"\[REMEMBER:\s*.*?\]", "", response).strip()

    # Persist the current turn to PostgreSQL (0 extra LLM calls)
    save_db = SessionLocal()
    try:
        add_message(save_db, role="user", message=user_message, user_id=user_id)
        add_message(save_db, role="assistant", message=clean_response, user_id=user_id)
    except Exception as e:
        print(f"Warning: Could not save message to chat_history: {e}")
    finally:
        save_db.close()

    if return_remembered:
        return clean_response, new_memories

    return clean_response


if __name__ == "__main__":
    import sys
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")

    print("--- Generic question ---")
    print(get_chat_response("What does a P/E ratio mean?"))

    print("\n--- Portfolio question ---")
    print(get_chat_response("How diversified is my portfolio?"))

    print("\n--- Single Stock question ---")
    print(get_chat_response("What is the current price and valuation of TCS?"))

    print("\n--- News/sentiment question (in portfolio) ---")
    print(get_chat_response("What's the recent news sentiment on Reliance?"))

    print("\n--- Dynamic ticker lookup test (not in portfolio/map) ---")
    print("Resolved ticker:", extract_ticker_from_message("what's the news on Suzlon?"))