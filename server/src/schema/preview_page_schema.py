from pydantic import BaseModel, HttpUrl
from datetime import datetime
from typing import Optional

class PreviewPageCreate(BaseModel):
    title: str
    description: str
    logo_url: Optional[HttpUrl] = None
    gradient: str
    font: str
    background_color: str
    text_color: str
    feedback_page_id: int  

class PreviewPageUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    feedback_page_id: Optional[int] = None

class PreviewPageResponse(BaseModel):
    id: int
    url_token: str
    title: str
    description: str
    expires_at: datetime
    user_id: int
    feedback_page_id: int  

