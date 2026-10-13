from typing import List, Dict, Set
from backend.app.core.roles import Role

class ComplaintStatus:
    SUBMITTED = "SUBMITTED"
    NEEDS_REVIEW = "NEEDS_REVIEW"
    TRIAGED = "TRIAGED"
    ASSIGNED = "ASSIGNED"
    IN_PROGRESS = "IN_PROGRESS"
    RESOLVED = "RESOLVED"
    CLOSED = "CLOSED"
    REOPENED = "REOPENED"
    REJECTED = "REJECTED"

# Allowed transitions per role
ALLOWED_TRANSITIONS: Dict[str, Dict[Role, Set[str]]] = {
    ComplaintStatus.SUBMITTED: {
        Role.ADMIN: {ComplaintStatus.TRIAGED, ComplaintStatus.NEEDS_REVIEW, ComplaintStatus.ASSIGNED, ComplaintStatus.REJECTED},
        Role.STAFF: {ComplaintStatus.TRIAGED, ComplaintStatus.ASSIGNED},
        Role.RESIDENT: set()
    },
    ComplaintStatus.NEEDS_REVIEW: {
        Role.ADMIN: {ComplaintStatus.TRIAGED, ComplaintStatus.ASSIGNED, ComplaintStatus.REJECTED},
        Role.STAFF: set(),
        Role.RESIDENT: set()
    },
    ComplaintStatus.TRIAGED: {
        Role.ADMIN: {ComplaintStatus.ASSIGNED, ComplaintStatus.IN_PROGRESS, ComplaintStatus.REJECTED},
        Role.STAFF: {ComplaintStatus.ASSIGNED, ComplaintStatus.IN_PROGRESS},
        Role.RESIDENT: set()
    },
    ComplaintStatus.ASSIGNED: {
        Role.ADMIN: {ComplaintStatus.IN_PROGRESS, ComplaintStatus.REASSIGNED if hasattr(ComplaintStatus, 'REASSIGNED') else ComplaintStatus.ASSIGNED, ComplaintStatus.REJECTED},
        Role.STAFF: {ComplaintStatus.IN_PROGRESS, ComplaintStatus.RESOLVED},
        Role.RESIDENT: set()
    },
    ComplaintStatus.IN_PROGRESS: {
        Role.ADMIN: {ComplaintStatus.RESOLVED, ComplaintStatus.ASSIGNED},
        Role.STAFF: {ComplaintStatus.RESOLVED},
        Role.RESIDENT: set()
    },
    ComplaintStatus.RESOLVED: {
        Role.ADMIN: {ComplaintStatus.CLOSED, ComplaintStatus.REOPENED},
        Role.STAFF: set(),
        Role.RESIDENT: {ComplaintStatus.CLOSED, ComplaintStatus.REOPENED}
    },
    ComplaintStatus.CLOSED: {
        Role.ADMIN: {ComplaintStatus.REOPENED},
        Role.STAFF: set(),
        Role.RESIDENT: {ComplaintStatus.REOPENED}
    },
    ComplaintStatus.REOPENED: {
        Role.ADMIN: {ComplaintStatus.ASSIGNED, ComplaintStatus.IN_PROGRESS},
        Role.STAFF: {ComplaintStatus.IN_PROGRESS},
        Role.RESIDENT: set()
    },
    ComplaintStatus.REJECTED: {
        Role.ADMIN: {ComplaintStatus.TRIAGED},
        Role.STAFF: set(),
        Role.RESIDENT: set()
    }
}

def can_transition(current_status: str, target_status: str, role: Role) -> bool:
    """Validates if current user role is authorized to enact status transition."""
    transitions = ALLOWED_TRANSITIONS.get(current_status, {})
    allowed_targets = transitions.get(role, set())
    return target_status in allowed_targets
