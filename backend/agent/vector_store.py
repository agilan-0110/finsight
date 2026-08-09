import chromadb
from chromadb.utils import embedding_functions
import os

# Path to persistent local storage — this is what makes it "just works" on clone
CHROMA_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data_store")

# Local embedding model — runs on CPU, no API key needed
embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="all-MiniLM-L6-v2"
)

# Persistent client — writes to disk, survives restarts
client = chromadb.PersistentClient(path=CHROMA_PATH)


def get_news_collection():
    """
    Returns the ChromaDB collection used to store news chunks.
    Created automatically on first call if it doesn't exist.
    """
    return client.get_or_create_collection(
        name="news_articles",
        embedding_function=embedding_fn,
    )