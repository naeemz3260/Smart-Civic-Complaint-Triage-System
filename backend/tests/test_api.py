import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"

def test_list_complaints():
    response = client.get("/api/complaints")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_statistics():
    response = client.get("/api/stats")
    assert response.status_code == 200
    data = response.json()
    assert "total_complaints" in data

def test_whatif_simulation():
    response = client.post("/api/whatif", json={
        "severity_weight": 0.4,
        "impact_weight": 0.2,
        "urgency_weight": 0.2,
        "vulnerability_weight": 0.2
    })
    assert response.status_code == 200
    items = response.json()
    assert isinstance(items, list)
