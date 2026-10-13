from enum import Enum
from fastapi import HTTPException, Header, status
from typing import Optional

class Role(str, Enum):
    RESIDENT = "resident"
    STAFF = "staff"
    ADMIN = "admin"

def verify_role(x_role: Optional[str] = Header("resident")) -> Role:
    """Extracts active role simulation header."""
    role_str = (x_role or "resident").lower()
    if role_str == "admin":
        return Role.ADMIN
    elif role_str == "staff":
        return Role.STAFF
    return Role.RESIDENT

def require_role(min_role: Role):
    def dependency(active_role: Role = Header(default="resident")):
        role_hierarchy = {Role.RESIDENT: 1, Role.STAFF: 2, Role.ADMIN: 3}
        current_enum = Role(active_role.lower()) if active_role.lower() in [r.value for r in Role] else Role.RESIDENT
        if role_hierarchy[current_enum] < role_hierarchy[min_role]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Action requires minimum '{min_role.value}' role permissions"
            )
        return current_enum
    return dependency
