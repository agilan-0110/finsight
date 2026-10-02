"""
memory_store.py
Long-term semantic user memory powered by local ChromaDB & all-MiniLM-L6-v2 embeddings.
Operates 100% locally on CPU for $0.00 cost with zero external API calls.
"""

import uuid
from datetime import datetime, timezone
from backend.agent.vector_store import get_memory_collection


def add_user_memory(fact: str, category: str = "general", user_id: int | None = None) -> str:
    """
    Stores a permanent personal fact/preference about the user.
    Automatically deduplicates if a very similar fact is already stored for this user.
    Returns the memory ID.
    """
    fact = fact.strip()
    if not fact or len(fact) < 5:
        return ""

    collection = get_memory_collection()
    timestamp = datetime.now(timezone.utc).isoformat()
    user_tag = str(user_id) if user_id is not None else "1"

    # Deduplication check: check if an identical or near-identical fact exists
    try:
        query_kwargs = {
            "query_texts": [fact],
            "n_results": 1,
            "where": {"user_id": user_tag},
        }
        existing = collection.query(**query_kwargs)
        if existing and existing.get("ids") and existing["ids"][0]:
            dist = existing["distances"][0][0]
            # Chroma L2 distance: lower means closer. ~0.25 or less indicates virtually identical content.
            if dist < 0.25:
                existing_id = existing["ids"][0][0]
                collection.update(
                    ids=[existing_id],
                    documents=[fact],
                    metadatas=[{"category": category, "user_id": user_tag, "updated_at": timestamp}]
                )
                return existing_id
    except Exception:
        pass

    memory_id = f"mem_{uuid.uuid4().hex[:8]}"
    collection.add(
        ids=[memory_id],
        documents=[fact],
        metadatas=[{"category": category, "user_id": user_tag, "created_at": timestamp}]
    )
    return memory_id


def update_user_memory(memory_id: str, new_fact: str, category: str = "general", user_id: int | None = None) -> bool:
    """
    Updates the text or category of an existing stored memory.
    """
    new_fact = new_fact.strip()
    if not new_fact or len(new_fact) < 3:
        return False

    collection = get_memory_collection()
    timestamp = datetime.now(timezone.utc).isoformat()
    user_tag = str(user_id) if user_id is not None else "1"

    try:
        collection.update(
            ids=[memory_id],
            documents=[new_fact],
            metadatas=[{"category": category, "user_id": user_tag, "updated_at": timestamp}]
        )
        return True
    except Exception as e:
        print(f"Error updating memory {memory_id}: {e}")
        return False


def retrieve_relevant_memories(query: str, top_k: int = 3, user_id: int | None = None) -> list[str]:
    """
    Retrieves the top_k most semantically relevant user facts for the given query.
    Keeps the prompt token-efficient by selecting only what matters to the current question.
    """
    collection = get_memory_collection()
    count = collection.count()
    if count == 0:
        return []

    limit = min(top_k, count)
    user_tag = str(user_id) if user_id is not None else "1"

    try:
        results = collection.query(
            query_texts=[query],
            n_results=limit,
            where={"user_id": user_tag}
        )
    except Exception:
        # Fallback without where clause if older items don't have user_id
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


def get_all_memories(user_id: int | None = None) -> list[dict]:
    """
    Returns all stored memories for the user management API (GET /memories).
    Filters by user_id metadata when provided.
    """
    collection = get_memory_collection()
    count = collection.count()
    if count == 0:
        return []

    user_tag = str(user_id) if user_id is not None else "1"

    try:
        data = collection.get(where={"user_id": user_tag})
    except Exception:
        data = collection.get()

    ids = data.get("ids", [])
    documents = data.get("documents", [])
    metadatas = data.get("metadatas", [])

    # If scoped query returned empty but legacy un-scoped items exist, fallback
    if not ids:
        raw_data = collection.get()
        raw_ids = raw_data.get("ids", [])
        raw_docs = raw_data.get("documents", [])
        raw_metas = raw_data.get("metadatas", [])
        filtered_ids, filtered_docs, filtered_metas = [], [], []
        for i, d, m in zip(raw_ids, raw_docs, raw_metas):
            item_uid = m.get("user_id") if m else None
            if item_uid is None or item_uid == user_tag or user_id is None:
                filtered_ids.append(i)
                filtered_docs.append(d)
                filtered_metas.append(m)
        ids, documents, metadatas = filtered_ids, filtered_docs, filtered_metas

    memories = []
    for mid, doc, meta in zip(ids, documents, metadatas):
        memories.append({
            "id": mid,
            "memory": doc,
            "category": meta.get("category", "general") if meta else "general",
            "created_at": meta.get("created_at") or meta.get("updated_at") if meta else None,
            "user_id": meta.get("user_id") if meta else None,
        })

    return memories


def delete_memory(memory_id: str, user_id: int | None = None) -> bool:
    """
    Deletes a specific memory by ID (DELETE /memories/{id}).
    """
    collection = get_memory_collection()
    try:
        collection.delete(ids=[memory_id])
        return True
    except Exception:
        return False


def clear_all_memories(user_id: int | None = None) -> int:
    """
    Deletes all user memories for the specified user (DELETE /memories).
    """
    collection = get_memory_collection()
    all_mems = get_all_memories(user_id=user_id)
    ids_to_del = [m["id"] for m in all_mems]
    if ids_to_del:
        collection.delete(ids=ids_to_del)
    return len(ids_to_del)


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
