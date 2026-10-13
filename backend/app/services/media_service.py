import os
import hashlib
from typing import Tuple, Optional, Dict, Any
from io import BytesIO

class MediaService:
    @staticmethod
    def extract_exif_gps(file_bytes: bytes) -> Optional[Dict[str, float]]:
        """
        Attempts to read real GPS latitude and longitude from photo EXIF tags (e.g. from smartphones).
        Returns {'lat': float, 'lng': float} if present, else None.
        """
        try:
            from PIL import Image, ExifTags
            img = Image.open(BytesIO(file_bytes))
            exif = img._getexif()
            if not exif:
                return None

            gps_info = {}
            for tag_id, value in exif.items():
                tag = ExifTags.TAGS.get(tag_id, tag_id)
                if tag == "GPSInfo":
                    for t in value:
                        sub_tag = ExifTags.GPSTAGS.get(t, t)
                        gps_info[sub_tag] = value[t]

            if "GPSLatitude" in gps_info and "GPSLongitude" in gps_info:
                def to_degrees(val):
                    d = float(val[0])
                    m = float(val[1])
                    s = float(val[2])
                    return d + (m / 60.0) + (s / 3600.0)

                lat = to_degrees(gps_info["GPSLatitude"])
                if gps_info.get("GPSLatitudeRef", "N").upper() == "S":
                    lat = -lat

                lng = to_degrees(gps_info["GPSLongitude"])
                if gps_info.get("GPSLongitudeRef", "E").upper() == "W":
                    lng = -lng

                return {"lat": round(lat, 6), "lng": round(lng, 6)}
        except Exception:
            pass
        return None

    @staticmethod
    def strip_exif_and_save(file_bytes: bytes, destination_path: str) -> Tuple[str, str, Optional[Dict[str, float]]]:
        """
        Extracts GPS coordinates (if present) before scrubbing EXIF,
        then saves a sanitized version to disk to protect citizen privacy.
        """
        os.makedirs(os.path.dirname(destination_path), exist_ok=True)
        gps = MediaService.extract_exif_gps(file_bytes)

        # Write sanitized/cleaned bytes
        try:
            from PIL import Image
            img = Image.open(BytesIO(file_bytes))
            # Save without EXIF dict
            data = list(img.getdata())
            image_without_exif = Image.new(img.mode, img.size)
            image_without_exif.putdata(data)
            image_without_exif.save(destination_path)
        except Exception:
            with open(destination_path, "wb") as f:
                f.write(file_bytes)

        sha256 = hashlib.sha256(file_bytes).hexdigest()
        return destination_path, sha256, gps
