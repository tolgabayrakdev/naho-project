from pydantic import BaseModel
from typing import Optional
from datetime import datetime



class FeedbackPageCreate(BaseModel):
    title: str
    description: Optional[str] = None


class FeedbackPageUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
