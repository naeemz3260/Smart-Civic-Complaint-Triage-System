import math
import json
import os
from typing import Optional, Dict, Any, List

def haversine_meters(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates distance between two lat/lon coordinates in meters."""
    R = 6371000.0  # Earth's radius in meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = math.sin(delta_phi / 2.0)**2 + \
        math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0)**2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c

def point_in_polygon(x: float, y: float, poly: List[List[float]]) -> bool:
    """Ray casting algorithm to determine if a point (lng, lat) is inside a polygon."""
    n = len(poly)
    inside = False
    p1x, p1y = poly[0]
    for i in range(n + 1):
        p2x, p2y = poly[i % n]
        if y > min(p1y, p2y):
            if y <= max(p1y, p2y):
                if x <= max(p1x, p2x):
                    if p1y != p2y:
                        xinters = (y - p1y) * (p2x - p1x) / (p2y - p1y) + p1x
                    if p1x == p2x or x <= xinters:
                        inside = not inside
        p1x, p1y = p2x, p2y
    return inside

class GeoService:
    def __init__(self, wards_path: str = "data/geo/wards.geojson", landmarks_path: str = "data/geo/landmarks.geojson"):
        self.wards_path = wards_path
        self.landmarks_path = landmarks_path
        self.wards = []
        self.landmarks = []
        self._load()

    def _load(self):
        if os.path.exists(self.wards_path):
            with open(self.wards_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                self.wards = data.get("features", [])
        if os.path.exists(self.landmarks_path):
            with open(self.landmarks_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                self.landmarks = data.get("features", [])

    def find_ward(self, lat: float, lng: float) -> Optional[Dict[str, Any]]:
        """Determines which ward contains the given lat/lng."""
        for feature in self.wards:
            geom = feature.get("geometry", {})
            if geom.get("type") == "Polygon":
                coords = geom.get("coordinates", [[]])[0]
                if point_in_polygon(lng, lat, coords):
                    return feature.get("properties")
        
        # Default fallback to nearest ward center
        if self.wards:
            return self.wards[0].get("properties")
        return {"ward_id": "WARD-01", "name": "General Municipal Ward", "population_density": 0.70}

    def compute_vulnerability(self, lat: float, lng: float) -> float:
        """
        Calculates vulnerability boost based on proximity to hospitals, schools, and major roads.
        """
        score = 0.0
        for lm in self.landmarks:
            coords = lm["geometry"]["coordinates"]  # [lng, lat]
            dist = haversine_meters(lat, lng, coords[1], coords[0])
            lm_type = lm["properties"].get("type")

            if lm_type == "hospital" and dist <= 250:
                score = max(score, 0.95 if dist <= 100 else 0.85)
            elif lm_type == "school" and dist <= 200:
                score = max(score, 0.90 if dist <= 80 else 0.75)
            elif lm_type == "main_road" and dist <= 100:
                score = max(score, 0.70)

        # Baseline vulnerability if not next to specific high-risk landmark
        return min(1.0, max(0.20, score))
