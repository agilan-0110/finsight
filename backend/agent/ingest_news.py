import requests
from bs4 import BeautifulSoup
import yfinance as yf
from backend.agent.vector_store import get_news_collection

HEADERS = {"User-Agent": "Mozilla/5.0"}
CHUNK_SIZE = 500
CHUNK_OVERLAP = 50


JUNK_PATTERNS = [
    "oops, something went wrong",
    "please enable javascript",
    "subscribe to continue reading",
    "you need to be logged in",
    "cookies to improve",
]


def scrape_article_text(url: str) -> str | None:
    try:
        response = requests.get(url, headers=HEADERS, timeout=5)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")

        paragraphs = soup.find_all("p")
        # Drop any paragraph that matches known junk patterns before joining
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
    words = text.split()
    chunks = []
    start = 0
    while start < len(words):
        end = start + CHUNK_SIZE
        chunks.append(" ".join(words[start:end]))
        start = end - CHUNK_OVERLAP
    return chunks


def ingest_news_for_ticker(ticker: str, max_articles: int = 5):
    collection = get_news_collection()
    stock = yf.Ticker(ticker)
    news_items = stock.news[:max_articles]

    added = 0
    for item in news_items:
        content = item.get("content", {})  # new nested structure

        title = content.get("title", "")
        summary = content.get("summary", "")
        uuid = item.get("id", title)

        # Prefer clickThroughUrl (usually the Yahoo Finance page), fall back to canonicalUrl
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

    return added


if __name__ == "__main__":
    count = ingest_news_for_ticker("RELIANCE.NS")
    print(f"Ingested {count} chunks.")