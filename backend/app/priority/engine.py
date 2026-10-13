from typing import Dict, Any, Optional
from backend.app.priority.factors import (
    compute_severity_factor,
    compute_impact_factor,
    compute_urgency_factor,
    compute_vulnerability_factor
)
from backend.app.core.config import city_config

class PriorityEngine:
    def __init__(self, custom_weights: Optional[Dict[str, float]] = None):
        cfg_weights = city_config.get("priority_weights", {})
        self.weights = custom_weights or {
            "severity": cfg_weights.get("severity", 0.35),
            "impact": cfg_weights.get("impact", 0.25),
            "urgency": cfg_weights.get("urgency", 0.25),
            "vulnerability": cfg_weights.get("vulnerability", 0.15),
        }

    def compute_priority(
        self,
        category: str,
        base_severity: float,
        is_critical_override: bool,
        ward_density: float,
        cluster_count: int,
        elapsed_hours: float,
        default_sla_hours: float,
        geo_vulnerability: float,
        weights_override: Optional[Dict[str, float]] = None
    ) -> Dict[str, Any]:
        """
        Calculates composite priority score (0.0 to 1.0) and detailed factor breakdown.
        """
        w = weights_override or self.weights
        total_w = sum(w.values()) or 1.0
        normalized_w = {k: v / total_w for k, v in w.items()}

        s = compute_severity_factor(category, base_severity, is_critical_override)
        i = compute_impact_factor(ward_density, cluster_count)
        u = compute_urgency_factor(category, elapsed_hours, default_sla_hours)
        v = compute_vulnerability_factor(geo_vulnerability)

        score = (
            normalized_w["severity"] * s +
            normalized_w["impact"] * i +
            normalized_w["urgency"] * u +
            normalized_w["vulnerability"] * v
        )

        final_score = round(min(1.0, max(0.0, score)), 3)

        return {
            "priority_score": final_score,
            "factors": {
                "severity": s,
                "impact": i,
                "urgency": u,
                "vulnerability": v
            },
            "weights_used": normalized_w
        }
