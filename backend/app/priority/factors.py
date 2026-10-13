from typing import Dict, Any, Optional

def compute_severity_factor(category: str, base_severity: float, is_critical_override: bool) -> float:
    """Computes severity factor (0.0 to 1.0)."""
    if is_critical_override:
        return 1.0
    return min(1.0, max(0.1, base_severity))

def compute_impact_factor(ward_density: float, cluster_count: int) -> float:
    """Computes impact factor based on ward population and clustered reports."""
    base_impact = 0.4 * ward_density
    cluster_boost = min(0.6, cluster_count * 0.12)
    return round(min(1.0, max(0.1, base_impact + cluster_boost)), 3)

def compute_urgency_factor(category: str, elapsed_hours: float, default_sla_hours: float) -> float:
    """Urgency increases as SLA deadline approaches or category dictates rapid degradation."""
    ratio = elapsed_hours / max(1.0, default_sla_hours)
    # Accelerated escalation for electricity or active sewage
    cat_multiplier = 1.2 if category in ["electricity", "sewage"] else 1.0
    urgency = min(1.0, (0.3 + 0.7 * ratio) * cat_multiplier)
    return round(max(0.1, urgency), 3)

def compute_vulnerability_factor(geo_vulnerability: float) -> float:
    """Vulnerability factor derived from hospital, school, and transit proximity."""
    return round(min(1.0, max(0.1, geo_vulnerability)), 3)
