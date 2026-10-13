import pytest
from backend.app.workflow.state_machine import can_transition, ComplaintStatus
from backend.app.core.roles import Role

def test_resident_transitions():
    # Resident cannot mark ticket in progress
    assert not can_transition(ComplaintStatus.SUBMITTED, ComplaintStatus.IN_PROGRESS, Role.RESIDENT)
    # Resident can close a resolved ticket
    assert can_transition(ComplaintStatus.RESOLVED, ComplaintStatus.CLOSED, Role.RESIDENT)

def test_staff_transitions():
    # Staff can start work and resolve
    assert can_transition(ComplaintStatus.ASSIGNED, ComplaintStatus.IN_PROGRESS, Role.STAFF)
    assert can_transition(ComplaintStatus.IN_PROGRESS, ComplaintStatus.RESOLVED, Role.STAFF)
    # Staff cannot close without admin/resident confirmation
    assert not can_transition(ComplaintStatus.RESOLVED, ComplaintStatus.CLOSED, Role.STAFF)

def test_admin_transitions():
    # Admin has triage and override powers
    assert can_transition(ComplaintStatus.SUBMITTED, ComplaintStatus.TRIAGED, Role.ADMIN)
    assert can_transition(ComplaintStatus.TRIAGED, ComplaintStatus.ASSIGNED, Role.ADMIN)
    assert can_transition(ComplaintStatus.RESOLVED, ComplaintStatus.CLOSED, Role.ADMIN)
