"""
ingest_news.py
Phase 4 — RAG news ingestion.

Fetches recent news for a ticker, filters out irrelevant articles
(yfinance sometimes mixes in broad macro/market news), scrapes full
article text where possible (falls back to yfinance's summary),
chunks the text, and stores it in ChromaDB for retrieval.
"""

import requests
from bs4 import BeautifulSoup
import yfinance as yf
from backend.agent.vector_store import get_news_collection

HEADERS = {"User-Agent": "Mozilla/5.0"}
CHUNK_SIZE = 500   # words per chunk
CHUNK_OVERLAP = 50  # words shared between consecutive chunks, preserves context across cuts

# Known junk phrases that indicate a failed/blocked scrape, not real content
JUNK_PATTERNS = [
    "oops, something went wrong",
    "please enable javascript",
    "subscribe to continue reading",
    "you need to be logged in",
    "cookies to improve",
]


def scrape_article_text(url: str) -> str | None:
    """
    Attempts to pull readable article text from a news URL.
    Returns None on failure so caller can fall back to the summary.
    """
    try:
        response = requests.get(url, headers=HEADERS, timeout=5)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")

        paragraphs = soup.find_all("p")
        clean_paragraphs = [
            p.get_text(strip=True) for p in paragraphs
            if not any(junk in p.get_text(strip=True).lower() for junk in JUNK_PATTERNS)
        ]
        text = " ".join(clean_paragraphs)

        if len(text.split()) < 50:
            return None
        return text
    except Exception:
        return None


def chunk_text(text: str) -> list[str]:
    """Splits text into overlapping word chunks so embeddings stay focused and retrieval is precise."""
    words = text.split()
    chunks = []
    start = 0
    while start < len(words):
        end = start + CHUNK_SIZE
        chunks.append(" ".join(words[start:end]))
        start = end - CHUNK_OVERLAP
    return chunks


def get_company_name_hint(ticker: str) -> str:
    """
    Gets a short company name to check article relevance against —
    uses yfinance's shortName/longName so we're not maintaining a
    separate name lookup just for this.
    """
    try:
        info = yf.Ticker(ticker).info
        return (info.get("shortName") or info.get("longName") or "").lower()
    except Exception:
        return ""


def is_relevant_article(title: str, summary: str, ticker: str, company_hint: str) -> bool:
    """
    Cheap relevance check: does the ticker's base name or company name
    hint actually appear in the article's title or summary?
    Filters out generic macro/market news that yfinance sometimes mixes in
    with a ticker's news feed.
    """
    text = f"{title} {summary}".lower()
    base_name = ticker.replace(".NS", "").lower()

    if base_name in text:
        return True
    if company_hint and any(word in text for word in company_hint.split() if len(word) > 3):
        return True
    return False


def ingest_news_for_ticker(ticker: str, max_articles: int = 5) -> int:
    """
    Fetches recent news for a ticker, filters for relevance, scrapes
    full text (falls back to summary), chunks it, and stores in
    ChromaDB with metadata for retrieval.

    Returns the number of chunks added.
    """
    collection = get_news_collection()
    stock = yf.Ticker(ticker)
    news_items = stock.news[:max_articles]
    company_hint = get_company_name_hint(ticker)

    added = 0
    skipped_irrelevant = 0

    for item in news_items:
        content = item.get("content", {})
        title = content.get("title", "")
        summary = content.get("summary", "")
        uuid = item.get("id", title)

        # Relevance check BEFORE scraping — avoids wasting a network
        # call on an article we're going to discard anyway
        if not is_relevant_article(title, summary, ticker, company_hint):
            skipped_irrelevant += 1
            continue

        url = ""
        if content.get("clickThroughUrl"):
            url = content["clickThroughUrl"].get("url", "")
        elif content.get("canonicalUrl"):
            url = content["canonicalUrl"].get("url", "")

        article_text = scrape_article_text(url) if url else None
        body = article_text if article_text else summary

        if not body:
            continue

        chunks = chunk_text(body)
        for i, chunk in enumerate(chunks):
            doc_id = f"{ticker}_{uuid}_{i}"
            collection.add(
                documents=[chunk],
                metadatas=[{
                    "ticker": ticker,
                    "title": title,
                    "url": url,
                    "source": "scraped" if article_text else "summary_fallback",
                    "chunk_index": i,
                }],
                ids=[doc_id],
            )
            added += 1

    print(f"{ticker}: added {added} chunks, skipped {skipped_irrelevant} irrelevant articles")
    return added


if __name__ == "__main__":
    # Quick manual test — run this file directly to ingest a few tickers at once
    for t in ["RELIANCE.NS", "ITC.NS", "TCS.NS", "INFY.NS", "HDFCBANK.NS"]:
        ingest_news_for_ticker(t)