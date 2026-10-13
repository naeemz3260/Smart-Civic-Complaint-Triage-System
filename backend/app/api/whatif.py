from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from backend.app.core.database import get_db
from backend.app.schemas.stats import WhatIfRequest, WhatIfItem
from backend.app.models.complaint import Complaint
from backend.app.priority.engine import PriorityEngine

router = APIRouter(prefix="/whatif", tags=["What-If Simulator"])

@router.post("", response_model=List[WhatIfItem])
def simulate_policy_weights(payload: WhatIfRequest, db: Session = Depends(get_db)):
    """
    Recalculates complaint priority ranking under hypothetical policy weights.
    Provides instant rank delta analysis for municipal decision makers.
    """
    engine = PriorityEngine()
    custom_weights = {
        "severity": payload.severity_weight,
        "impact": payload.impact_weight,
        "urgency": payload.urgency_weight,
        "vulnerability": payload.vulnerability_weight
    }

    complaints = db.query(Complaint).all()
    # Sort original
    sorted_orig = sorted(complaints, key=lambda c: c.priority_score, reverse=True)
    orig_rank_map = {c.id: idx + 1 for idx, c in enumerate(sorted_orig)}

    simulated_list = []
    for c in complaints:
        # Re-score with factor inputs
        total_w = sum(custom_weights.values()) or 1.0
        w = {k: v / total_w for k, v in custom_weights.items()}

        sim_score = (
            w["severity"] * c.severity_factor +
            w["impact"] * c.impact_factor +
            w["urgency"] * c.urgency_factor +
            w["vulnerability"] * c.vulnerability_factor
        )
        sim_score = round(min(1.0, max(0.0, sim_score)), 3)
        simulated_list.append((c, sim_score))

    # Sort simulated
    simulated_list.sort(key=lambda x: x[1], reverse=True)

    items = []
    for new_rank, (c, sim_score) in enumerate(simulated_list, start=1):
        orig_rank = orig_rank_map.get(c.id, new_rank)
        items.append(WhatIfItem(
            id=c.id,
            category=c.category,
            original_score=c.priority_score,
            simulated_score=sim_score,
            original_rank=orig_rank,
            simulated_rank=new_rank,
            rank_delta=orig_rank - new_rank  # Positive delta means increased in urgency
        ))

    return items
