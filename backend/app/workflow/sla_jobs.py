import datetime
from typing import Dict, Any

def check_sla_status(created_at: datetime.datetime, sla_due_at: datetime.datetime, resolved_at: datetime.datetime = None) -> Dict[str, Any]:
    """
    Computes SLA compliance, hours remaining, and breach flags.
    """
    now = datetime.datetime.utcnow()
    total_allowed_sec = (sla_due_at - created_at).total_seconds()
    
    if resolved_at:
        is_breached = resolved_at > sla_due_at
        hours_to_resolve = (resolved_at - created_at).total_seconds() / 3600.0
        return {
            "status": "COMPLETED",
            "is_breached": is_breached,
            "hours_remaining": 0.0,
            "completion_hours": round(hours_to_resolve, 1)
        }
    
    remaining_sec = (sla_due_at - now).total_seconds()
    is_breached = remaining_sec <= 0
    hours_remaining = round(remaining_sec / 3600.0, 1)
    
    # SLA health: SAFE, WARNING, CRITICAL, BREACHED
    if is_breached:
        health = "BREACHED"
    elif hours_remaining <= 4.0:
        health = "CRITICAL"
    elif hours_remaining <= 12.0:
        health = "WARNING"
    else:
        health = "SAFE"

    return {
        "status": "ACTIVE",
        "health": health,
        "is_breached": is_breached,
        "hours_remaining": hours_remaining,
        "progress_ratio": max(0.0, min(1.0, 1.0 - (remaining_sec / max(1.0, total_allowed_sec))))
    }
