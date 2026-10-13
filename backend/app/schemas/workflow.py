from pydantic import BaseModel
from typing import Optional

class StatusTransitionRequest(BaseModel):
    to_status: str
    comment: Optional[str] = None
    assigned_to: Optional[str] = None

class ClosureVerificationRequest(BaseModel):
    after_photo_filename: str
    comment: Optional[str] = None

class HumanReviewDecision(BaseModel):
    review_item_id: int
    confirmed_category: str
    comment: Optional[str] = None
