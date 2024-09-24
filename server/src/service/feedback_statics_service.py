from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from ..model import Feedback, FeedbackPage, PreviewPage, User
from fastapi import HTTPException
from datetime import datetime

class FeedbackStaticsService:

    @staticmethod
    def get_feedback_statics(db: Session, user_id: int):
        try:
            # Toplam feedback sayısı
            total_feedback_count = db.query(func.count(Feedback.id)).join(FeedbackPage).join(PreviewPage).filter(PreviewPage.user_id == user_id).scalar()

            # Toplam kullanıcı sayısı
            total_users_count = db.query(func.count(User.id)).scalar()

            # Toplam geliştirici sayısı
            total_developers_count = db.query(func.count(User.id)).filter(User.role == 'developer').scalar()

            # Aylık feedback sayısı
            current_year = datetime.now().year
            monthly_feedback_counts = {}
            for month in range(1, 13):
                count = db.query(func.count(Feedback.id)).join(FeedbackPage).join(PreviewPage).filter(
                    PreviewPage.user_id == user_id,
                    extract('year', Feedback.created_at) == current_year,
                    extract('month', Feedback.created_at) == month
                ).scalar()
                monthly_feedback_counts[datetime(current_year, month, 1).strftime('%B')] = count

            # Feedback türlerinin toplam sayısı
            feedback_type_counts = db.query(Feedback.feedback_type, func.count(Feedback.id)).join(FeedbackPage).join(PreviewPage).filter(
                PreviewPage.user_id == user_id
            ).group_by(Feedback.feedback_type).all()

            return {
                "total_feedback_count": total_feedback_count,
                "total_users_count": total_users_count,
                "total_developers_count": total_developers_count,
                "monthly_feedback_counts": monthly_feedback_counts,
                "feedback_type_counts": feedback_type_counts
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))