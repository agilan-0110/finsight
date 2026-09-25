"""
memory_store.py
Long-term semantic user memory powered by local ChromaDB & all-MiniLM-L6-v2 embeddings.
Operates 100% locally on CPU for $0.00 cost with zero external API calls.
"""

import uuid
from datetime import datetime, timezone
from backend.agent.vector_store import get_memory_collection


def add_user_memory(fact: str, category: str = "general") -> str:
    """
    Stores a permanent personal fact/preference about the user.
    Automatically deduplicates if a very similar fact is already stored.
    Returns the memory ID.
    """
    fact = fact.strip()
    if not fact or len(fact) < 5:
        return ""

    collection = get_memory_collection()
    timestamp = datetime.now(timezone.utc).isoformat()

    # Deduplication check: check if an identical or near-identical fact exists
    try:
        existing = collection.query(
            query_texts=[fact],
            n_results=1
        )
        if existing and existing.get("ids") and existing["ids"][0]:
            dist = existing["distances"][0][0]
            # Chroma L2 distance: lower means closer. ~0.2 or less indicates virtually identical content.
            if dist < 0.2:
                existing_id = existing["ids"][0][0]
                collection.update(
                    ids=[existing_id],
                    documents=[fact],
                    metadatas=[{"category": category, "updated_at": timestamp}]
                )
                return existing_id
    except Exception:
        pass

    memory_id = f"mem_{uuid.uuid4().hex[:8]}"
    collection.add(
        ids=[memory_id],
        documents=[fact],
        metadatas=[{"category": category, "created_at": timestamp}]
    )
    return memory_id


def retrieve_relevant_memories(query: str, top_k: int = 3) -> list[str]:
    """
    Retrieves the top_k most semantically relevant user facts for the given query.
    Keeps the prompt token-efficient by selecting only what matters to the current question.
    """
    collection = get_memory_collection()
    count = collection.count()
    if count == 0:
        return []

    limit = min(top_k, count)
    results = collection.query(
        query_texts=[query],
        n_results=limit
    )

    documents = results.get("documents", [[]])[0]
    distances = results.get("distances", [[]])[0]

    # Return memories that have a meaningful semantic match (distance < 1.3)
    relevant = []
    for doc, dist in zip(documents, distances):
        if dist < 1.3:
            relevant.append(doc)

    return relevant


def get_all_memories() -> list[dict]:
    """
    Returns all stored memories for the user management API (GET /memories).
    """
    collection = get_memory_collection()
    count = collection.count()
    if count == 0:
        return []

    data = collection.get()
    ids = data.get("ids", [])
    documents = data.get("documents", [])
    metadatas = data.get("metadatas", [])

    memories = []
    for mid, doc, meta in zip(ids, documents, metadatas):
        memories.append({
            "id": mid,
            "memory": doc,
            "category": meta.get("category", "general") if meta else "general",
            "created_at": meta.get("created_at") or meta.get("updated_at") if meta else None
        })

    return memories


def delete_memory(memory_id: str) -> bool:
    """
    Deletes a specific memory by ID (DELETE /memories/{id}).
    """
    collection = get_memory_collection()
    try:
        collection.delete(ids=[memory_id])
        return True
    except Exception:
        return False


def clear_all_memories() -> int:
    """
    Deletes all user memories (DELETE /memories).
    """
    collection = get_memory_collection()
    count = collection.count()
    if count > 0:
        all_ids = collection.get().get("ids", [])
        if all_ids:
            collection.delete(ids=all_ids)
    return count


if __name__ == "__main__":
    print("Testing memory_store...")
    m1 = add_user_memory("User works as a software engineer in Bangalore", "background")
    m2 = add_user_memory("User has a 3-year goal to purchase a house, needs liquidity in 2029", "financial_goal")
    m3 = add_user_memory("User avoids high-debt companies and sin stocks (tobacco)", "preference")

    print(f"Added memories: {m1}, {m2}, {m3}")
    print("\nAll memories:")
    print(get_all_memories())

    print("\nRetrieval for 'Should I invest in real estate or home loan?':")
    print(retrieve_relevant_memories("Should I invest in real estate or home loan?"))

    print("\nRetrieval for 'What do you think of ITC?':")
    print(retrieve_relevant_memories("What do you think of ITC?"))
