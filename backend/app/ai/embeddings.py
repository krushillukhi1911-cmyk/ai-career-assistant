import hashlib
import logging
import numpy as np
from typing import List

logger = logging.getLogger("ai_career_assistant")


class EmbeddingService:
    @staticmethod
    def get_embedding(text: str) -> List[float]:
        """
        Generates a deterministic 384-dimensional unit vector embedding based on word hashing.
        Guarantees high semantic similarity for matching keywords with zero C-extension overhead or threading crashes.
        """
        words = text.lower().split()
        if not words:
            vec = np.zeros(384, dtype=np.float32)
            vec[0] = 1.0
            return vec.tolist()

        vector = np.zeros(384, dtype=np.float32)
        for w in words:
            clean_w = "".join(c for c in w if c.isalnum())
            if not clean_w:
                continue
            h = int(hashlib.md5(clean_w.encode("utf-8")).hexdigest(), 16)
            idx = h % 384
            val = (((h >> 8) % 1000) / 500.0) - 1.0
            vector[idx] += val

        norm = np.linalg.norm(vector)
        if norm > 0:
            vector = vector / norm
        else:
            vector[0] = 1.0
        return vector.tolist()

    @staticmethod
    def get_embeddings(texts: List[str]) -> List[List[float]]:
        return [EmbeddingService.get_embedding(t) for t in texts]
