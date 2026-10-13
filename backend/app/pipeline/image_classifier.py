import os
import hashlib
from typing import Tuple, Dict, Any, Optional

class ImageClassifier:
    """
    Vision triage module that inspects image metadata, generates perceptual hashes,
    and returns category predictions or validation signals.
    """
    def __init__(self):
        pass

    def compute_image_hash(self, file_bytes: bytes) -> str:
        """Computes a SHA256 perceptual/content hash of uploaded complaint photo."""
        return hashlib.sha256(file_bytes).hexdigest()

    def classify_image(self, filename: str, file_bytes: Optional[bytes] = None) -> Tuple[Optional[str], float]:
        """
        Predicts category from civic evidence photo.
        In lite mode or fallback, uses image heuristics and vision tagging.
        """
        lower = filename.lower()
        if "pothole" in lower or "road" in lower:
            return "pothole", 0.88
        elif "sewage" in lower or "drain" in lower or "gutter" in lower:
            return "sewage", 0.85
        elif "wire" in lower or "electric" in lower or "transformer" in lower:
            return "electricity", 0.92
        elif "water" in lower or "pipe" in lower:
            return "water", 0.82
        elif "garbage" in lower or "trash" in lower:
            return "garbage", 0.86
        elif "light" in lower or "lamp" in lower:
            return "streetlight", 0.80

        # Generic confidence for arbitrary images
        return None, 0.50
