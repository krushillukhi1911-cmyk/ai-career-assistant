import os
import pickle
import logging
import numpy as np
from typing import List, Dict, Any, Optional
import faiss
from app.ai.embeddings import EmbeddingService
from app.core.config import settings

logger = logging.getLogger("ai_career_assistant")


class VectorStore:
    def __init__(self, storage_dir: str = None):
        self.storage_dir = storage_dir or settings.VECTOR_STORE_PATH
        os.makedirs(self.storage_dir, exist_ok=True)
        self.dimension = 384  # Standard dimension for all-MiniLM-L6-v2
        self.index = faiss.IndexFlatIP(self.dimension)  # Inner Product (Cosine similarity when normalized)
        self.documents: List[Dict[str, Any]] = []
        self._load_store()

    def _get_index_path(self) -> str:
        return os.path.join(self.storage_dir, "faiss_index.bin")

    def _get_docs_path(self) -> str:
        return os.path.join(self.storage_dir, "faiss_docs.pkl")

    def _load_store(self):
        index_path = self._get_index_path()
        docs_path = self._get_docs_path()
        if os.path.exists(index_path) and os.path.exists(docs_path):
            try:
                self.index = faiss.read_index(index_path)
                with open(docs_path, "rb") as f:
                    self.documents = pickle.load(f)
                logger.info(f"Loaded {len(self.documents)} vector documents from {self.storage_dir}")
            except Exception as e:
                logger.warning(f"Could not load vector store from disk ({e}). Initializing empty index.")
                self.index = faiss.IndexFlatIP(self.dimension)
                self.documents = []

    def save_store(self):
        try:
            faiss.write_index(self.index, self._get_index_path())
            with open(self._get_docs_path(), "wb") as f:
                pickle.dump(self.documents, f)
            logger.info("Saved vector index and documents to disk.")
        except Exception as e:
            logger.error(f"Failed to save vector store: {e}")

    def add_texts(self, texts: List[str], metadatas: List[Dict[str, Any]]) -> List[int]:
        if not texts:
            return []
        embeddings = EmbeddingService.get_embeddings(texts)
        embeddings_np = np.array(embeddings, dtype=np.float32)
        
        # Normalize vectors for cosine similarity
        faiss.normalize_L2(embeddings_np)
        
        start_idx = len(self.documents)
        self.index.add(embeddings_np)
        
        added_ids = []
        for i, (text, meta) in enumerate(zip(texts, metadatas)):
            doc_idx = start_idx + i
            doc_entry = {
                "id": doc_idx,
                "text": text,
                "metadata": meta,
            }
            self.documents.append(doc_entry)
            added_ids.append(doc_idx)

        self.save_store()
        return added_ids

    def similarity_search(
        self, query: str, top_k: int = 4, filter_user_id: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        if self.index.ntotal == 0 or not self.documents:
            return []

        query_emb = EmbeddingService.get_embedding(query)
        query_np = np.array([query_emb], dtype=np.float32)
        faiss.normalize_L2(query_np)

        # Search top_k * 3 to allow filtering by user_id
        search_k = min(top_k * 3, self.index.ntotal)
        distances, indices = self.index.search(query_np, search_k)

        results = []
        for dist, idx in zip(distances[0], indices[0]):
            if idx < 0 or idx >= len(self.documents):
                continue
            doc = self.documents[idx]
            meta = doc.get("metadata", {})
            
            if filter_user_id and meta.get("user_id") and meta.get("user_id") != filter_user_id:
                continue

            results.append({
                "text": doc["text"],
                "metadata": meta,
                "score": float(dist)
            })

            if len(results) >= top_k:
                break

        return results

    def clear_user_docs(self, user_id: str):
        """
        Filters out user docs and rebuilds index.
        """
        remaining_docs = [d for d in self.documents if d.get("metadata", {}).get("user_id") != user_id]
        self.index = faiss.IndexFlatIP(self.dimension)
        self.documents = []
        if remaining_docs:
            texts = [d["text"] for d in remaining_docs]
            metas = [d["metadata"] for d in remaining_docs]
            self.add_texts(texts, metas)
        else:
            self.save_store()


# Global vector store instance
global_vector_store = VectorStore()
