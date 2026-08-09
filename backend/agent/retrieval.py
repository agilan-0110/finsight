from backend.agent.vector_store import get_news_collection


def retrieve_relevant_news(query: str, ticker: str | None = None, top_k: int = 3) -> list[dict]:
    """
    Retrieves the top_k most relevant news chunks for a query.
    If ticker is provided, filters results to that ticker only.
    Returns a list of dicts with text + metadata, ready to inject into a prompt.
    """
    collection = get_news_collection()

    where_filter = {"ticker": ticker} if ticker else None

    results = collection.query(
        query_texts=[query],
        n_results=top_k,
        where=where_filter,
    )

    # Chroma returns nested lists (one per query) — we only sent one query, so unwrap index 0
    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]
    distances = results.get("distances", [[]])[0]

    retrieved = []
    for doc, meta, dist in zip(documents, metadatas, distances):
        retrieved.append({
            "text": doc,
            "title": meta.get("title", ""),
            "url": meta.get("url", ""),
            "source": meta.get("source", ""),
            "relevance_score": round(1 - dist, 3),  # Chroma gives distance; lower = more similar, so we flip it
        })

    return retrieved


if __name__ == "__main__":
    # Manual test
    results = retrieve_relevant_news("How is Reliance performing?", ticker="RELIANCE.NS")
    for r in results:
        print(f"[{r['relevance_score']}] {r['title']} ({r['source']})")
        print(r['text'][:200], "...\n")