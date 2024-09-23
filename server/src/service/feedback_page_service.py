from sqlalchemy.orm import Session
from ..schema.feedback_page_schema import FeedbackPageCreate, FeedbackPageUpdate
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException
from ..model import FeedbackPage, User
from datetime import datetime, timedelta
import uuid


class FeedbackPageService:

    @staticmethod
    def create(db: Session, payload: FeedbackPageCreate, user_id: int):
        try:
            expires_at = datetime.now() + timedelta(days=30)
            feedback = FeedbackPage(
                title=payload.title,
                description=payload.description,
                url_token=uuid.uuid4().hex,
                expires_at=expires_at,
                user_id=user_id,
            )
            db.add(feedback)
            db.commit()
            db.refresh(feedback)
            return feedback
        except SQLAlchemyError:
            db.rollback()
            raise HTTPException(
                status_code=500, detail="An unexpected server error occurred."
            )

    @staticmethod
    def update(db: Session, feedback_id: int, payload: FeedbackPageUpdate):
        try:
            feedback = (
                db.query(FeedbackPage).filter(FeedbackPage.id == feedback_id).first()
            )
            if feedback:
                for key, value in payload.model_dump(exclude_unset=True).items():
                    setattr(feedback, key, value)
                db.commit()
                db.refresh(feedback)
                return feedback
            else:
                raise HTTPException(status_code=404, detail="Feedback not found")
        except SQLAlchemyError:
            db.rollback()
            raise HTTPException(
                status_code=500, detail="An unexpected server error occurred."
            )

    @staticmethod
    def delete(db: Session, feedback_id: int):
        try:
            feedback = (
                db.query(FeedbackPage).filter(FeedbackPage.id == feedback_id).first()
            )
            if feedback:
                db.delete(feedback)
                db.commit()
                return {"message": "Feedback deleted"}
            else:
                raise HTTPException(status_code=404, detail="Feedback not found")
        except SQLAlchemyError:
            db.rollback()
            raise HTTPException(
                status_code=500, detail="An unexpected server error occurred."
            )

    @staticmethod
    def is_token_expired(db: Session, feedback_id: int):
        feedback = db.query(FeedbackPage).filter(FeedbackPage.id == feedback_id).first()
        if feedback:
            return feedback.expires_at < datetime.now()
        else:
            raise HTTPException(status_code=404, detail="Feedback not found")

    @staticmethod
    def get_all(db: Session):
        return (
            db.query(FeedbackPage)
            .filter(FeedbackPage.expires_at >= datetime.now())
            .all()
        )
    

    @staticmethod
    def show(db: Session, url_token: str):
        feedback = (
            db.query(FeedbackPage).filter(FeedbackPage.url_token == url_token).first()
        )
        if feedback:
            if feedback.expires_at < datetime.now(): #type: ignore
                raise HTTPException(status_code=400, detail="Token has expired")
            user = db.query(User).filter(User.id == feedback.user_id).first()
            if user:
                return {
                    "id": feedback.id,
                    "title": feedback.title,
                    "description": feedback.description,
                    "url_token": feedback.url_token,
                    "expires_at": feedback.expires_at,
                    "username": user.username,
                    "email": user.email,
                }
            else:
                raise HTTPException(status_code=404, detail="User not found")
        else:
            raise HTTPException(status_code=404, detail="Feedback not found")