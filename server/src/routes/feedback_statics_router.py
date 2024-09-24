from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..model import User
from ..security.authenticated_user import authenticated_user
from ..database import get_db
from ..service.feedback_statics_service import FeedbackStaticsService

router = APIRouter()

@router.get("/feedback/statics")
def get_feedback_statics(db: Session = Depends(get_db), current_user: dict = Depends(authenticated_user)):
    return FeedbackStaticsService.get_feedback_statics(db, user_id=current_user["id"])
