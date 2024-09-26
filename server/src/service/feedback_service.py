from sqlalchemy.orm import Session
from ..model import Feedback, FeedbackPage, PreviewPage
from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError


class FeedbackService:


    @staticmethod
    def list(db: Session, user_id: int):
        feedbacks = db.query(Feedback).join(FeedbackPage).join(PreviewPage).filter(PreviewPage.user_id == user_id).all()
        return feedbacks
    
    @staticmethod
    def delete(db: Session, feedback_id: int, user_id: int):
        try:
            feedback = (
                db.query(Feedback).join(FeedbackPage).join(PreviewPage)
                .filter(Feedback.id == feedback_id, PreviewPage.user_id == user_id).first()
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
    def delete_all(db: Session, user_id: int):
        try:
            feedbacks = db.query(Feedback).join(FeedbackPage).join(PreviewPage).filter(PreviewPage.user_id == user_id).all()
            for feedback in feedbacks:
                db.delete(feedback)
            db.commit()
            return {"message": "All feedbacks deleted"}
        except SQLAlchemyError:
            db.rollback()
            raise HTTPException(
                status_code=500, detail="An unexpected server error occurred."
            )

    @staticmethod
    def list_by_user(db: Session, user_id: int):
        return db.query(Feedback).join(FeedbackPage).join(PreviewPage).filter(PreviewPage.user_id == user_id).all()