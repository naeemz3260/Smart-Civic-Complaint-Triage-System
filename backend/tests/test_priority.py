import pytest
from backend.app.priority.factors import (
    compute_severity_factor,
    compute_impact_factor,
    compute_urgency_factor,
    compute_vulnerability_factor
)
from backend.app.priority.engine import PriorityEngine

def test_priority_factors():
    # Severity test
    assert compute_severity_factor("electricity", 0.9, False) == 0.9
    assert compute_severity_factor("electricity", 0.9, True) == 1.0

    # Impact test
    imp = compute_impact_factor(ward_density=0.8, cluster_count=3)
    assert 0.0 <= imp <= 1.0

    # Urgency test
    urg = compute_urgency_factor("electricity", 6.0, 12.0)
    assert urg > 0.5

    # Vulnerability test
    vuln = compute_vulnerability_factor(0.85)
    assert vuln == 0.85

def test_priority_engine_composite():
    engine = PriorityEngine()
    result = engine.compute_priority(
        category="pothole",
        base_severity=0.65,
        is_critical_override=False,
        ward_density=0.85,
        cluster_count=1,
        elapsed_hours=10.0,
        default_sla_hours=48.0,
        geo_vulnerability=0.75
    )
    assert "priority_score" in result
    score = result["priority_score"]
    assert 0.0 <= score <= 1.0
    assert result["factors"]["severity"] == 0.65
