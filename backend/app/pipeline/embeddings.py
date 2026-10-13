import numpy as np
from typing import List, Union
import os

# Open-source recommendation from the prompt:
# 'paraphrase-multilingual-MiniLM-L12-v2' via sentence-transformers
# Or 'sentence-transformers/all-MiniLM-L6-v2' for ultra-lightweight CPU

_MODEL_INSTANCE = None
MODEL_NAME = os.getenv("EMBEDDING_MODEL_NAME", "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")

def get_embedding_model():
    """
    Lazy-loads the sentence-transformers model if installed,
    otherwise provides a deterministic fast hash-vector fallback for demo mode.
    """
    global _MODEL_INSTANCE
    if _MODEL_INSTANCE is not None:
        return _MODEL_INSTANCE

    try:
        from sentence_transformers import SentenceTransformer
        _MODEL_INSTANCE = SentenceTransformer(MODEL_NAME)
        return _MODEL_INSTANCE
    except Exception:
        # Graceful fallback if sentence-transformers is not yet downloaded
        return None

def compute_text_embedding(text: str) -> np.ndarray:
    """
    Computes a 384-dimensional dense float32 vector for input text (English, Urdu, or Roman Urdu).
    """
    model = get_embedding_model()
    if model is not None:
        emb = model.encode(text, convert_to_numpy=True, normalize_embeddings=True)
        return emb.astype(np.float32)

    # Lightweight deterministic pseudo-embedding fallback (384-dim)
    import hashlib
    h = hashlib.sha256(text.encode('utf-8')).digest()
    np.random.seed(int.from_bytes(h[:4], 'big'))
    vec = np.random.randn(384).astype(np.float32)
    norm = np.linalg.norm(vec)
    return vec / (norm if norm > 0 else 1.0)

def cosine_similarity(v1: np.ndarray, v2: np.ndarray) -> float:
    """Computes cosine similarity between two 1D float32 vectors."""
    dot = np.dot(v1, v2)
    n1 = np.linalg.norm(v1)
    n2 = np.linalg.norm(v2)
    if n1 == 0 or n2 == 0:
        return 0.0
    return float(dot / (n1 * n2))
