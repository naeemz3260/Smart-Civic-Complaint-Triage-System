import pytest
from backend.app.pipeline.geo import haversine_meters, GeoService

def test_haversine_distance():
    # Distance between two nearby coordinates in meters
    d = haversine_meters(24.8607, 67.0011, 24.8610, 67.0015)
    assert 0 < d < 100

def test_geo_service_vulnerability():
    geo = GeoService()
    # Query location near City General Teaching Hospital (24.8550, 67.0250)
    score = geo.compute_vulnerability(24.8552, 67.0252)
    assert score >= 0.8
