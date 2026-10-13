from pydantic import BaseModel
from typing import Dict, Any, List

class CityStatsResponse(BaseModel):
    total_complaints: int
    resolved_count: int
    pending_count: int
    breached_count: int
    sla_compliance_rate: float
    auto_triage_rate: float
    category_distribution: Dict[str, int]
    ward_distribution: Dict[str, int]

class HotspotPoint(BaseModel):
    id: str
    latitude: float
    longitude: float
    intensity: float
    category: str
    ward_id: str
    count: int

class WhatIfRequest(BaseModel):
    severity_weight: float
    impact_weight: float
    urgency_weight: float
    vulnerability_weight: float

class WhatIfItem(BaseModel):
    id: str
    category: str
    original_score: float
    simulated_score: float
    original_rank: int
    simulated_rank: int
    rank_delta: int
