from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from ..model import Feedback, FeedbackPage, PreviewPage
from fastapi import HTTPException
from datetime import datetime, timedelta

class FeedbackStaticsService:

    @staticmethod
    def get_feedback_statics(db: Session, user_id: int):
        try:
            # Toplam feedback sayısı
            total_feedback_count = db.query(func.count(Feedback.id)).join(FeedbackPage).join(PreviewPage).filter(PreviewPage.user_id == user_id).scalar()

            # Aylık feedback sayısı
            one_month_ago = datetime.now() - timedelta(days=30)
            monthly_feedback_count = db.query(func.count(Feedback.id)).join(FeedbackPage).join(PreviewPage).filter(
                PreviewPage.user_id == user_id,
                Feedback.created_at >= one_month_ago
            ).scalar()

            # Feedback türlerinin toplam sayısı
            feedback_type_counts = db.query(Feedback.feedback_type, func.count(Feedback.id)).join(FeedbackPage).join(PreviewPage).filter(
                PreviewPage.user_id == user_id
            ).group_by(Feedback.feedback_type).all()

            # Convert feedback_type_counts to a list of dictionaries
            feedback_type_counts_dicts = [{"feedback_type": ftc[0], "count": ftc[1]} for ftc in feedback_type_counts]

            # Feedback count for each month
            monthly_feedback_counts = db.query(
                extract('year', Feedback.created_at).label('year'),
                extract('month', Feedback.created_at).label('month'),
                func.count(Feedback.id).label('count')
            ).join(FeedbackPage).join(PreviewPage).filter(
                PreviewPage.user_id == user_id
            ).group_by(
                extract('year', Feedback.created_at),
                extract('month', Feedback.created_at)
            ).order_by(
                extract('year', Feedback.created_at),
                extract('month', Feedback.created_at)
            ).all()

            # Convert monthly_feedback_counts to a list of dictionaries
            monthly_feedback_counts_dicts = [
                {"year": int(mfc[0]), "month": int(mfc[1]), "count": mfc[2]} for mfc in monthly_feedback_counts
            ]

            return {
                "total_feedback_count": total_feedback_count,
                "monthly_feedback_count": monthly_feedback_count,
                "feedback_type_counts": feedback_type_counts_dicts,
                "monthly_feedback_counts": monthly_feedback_counts_dicts
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))