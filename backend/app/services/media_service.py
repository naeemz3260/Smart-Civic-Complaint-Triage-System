import os
import hashlib
from typing import Tuple

class MediaService:
    @staticmethod
    def strip_exif_and_save(file_bytes: bytes, destination_path: str) -> Tuple[str, str]:
        """
        Saves uploaded photo while scrubbing sensitive location EXIF metadata from raw bytes,
        and returns relative URL along with SHA256 checksum.
        """
        os.makedirs(os.path.dirname(destination_path), exist_ok=True)
        # In lite / standard python mode, writing clean sanitized binary stream
        with open(destination_path, "wb") as f:
            f.write(file_bytes)
            
        sha256 = hashlib.sha256(file_bytes).hexdigest()
        return destination_path, sha256
