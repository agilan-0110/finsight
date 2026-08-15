from functools import lru_cache

from transformers import pipeline


@lru_cache(maxsize=1)
def get_sentiment_pipeline():
    """
    Lazily loads the FinBERT sentiment pipeline once and caches it.
    Mirrors the singleton pattern used by get_news_collection() in vector_store.py —
    avoids reloading the model on every call.
    """
    return pipeline(
        "sentiment-analysis",
        model="ProsusAI/finbert",
        tokenizer="ProsusAI/finbert",
    )


def classify_sentiment(text: str) -> dict:
    """
    Classifies a single piece of text as positive / negative / neutral using FinBERT.
    Returns a dict: {"label": str, "confidence": float}
    """
    if not text or not text.strip():
        return {"label": "neutral", "confidence": 0.0}

    classifier = get_sentiment_pipeline()

    # FinBERT truncates at 512 tokens internally, but pipeline() needs an explicit
    # truncation flag or it'll error out on long chunks (our chunks are ~500 words,
    # which can exceed 512 tokens once tokenized).
    result = classifier(text, truncation=True, max_length=512)[0]

    return {
        "label": result["label"],       # "positive" | "negative" | "neutral"
        "confidence": round(result["score"], 3),
    }


def attach_sentiment(retrieved: list[dict]) -> list[dict]:
    """
    Takes the output of retrieve_relevant_news() and attaches a "sentiment" key
    to each dict in place. Returns the same list shape so it can drop directly
    into build_news_context() without changing retrieval.py.
    """
    for item in retrieved:
        item["sentiment"] = classify_sentiment(item["text"])

    return retrieved


if __name__ == "__main__":
    # Manual test — no ChromaDB needed, just checking the model loads and scores sensibly
    samples = [
        "Reliance Industries reported record quarterly profit, beating analyst estimates.",
        "The company's stock plunged after missing revenue targets and issuing weak guidance.",
        "The board will meet next Tuesday to review the quarterly filing.",
    ]

    for s in samples:
        result = classify_sentiment(s)
        print(f"[{result['label']} | {result['confidence']}] {s}")