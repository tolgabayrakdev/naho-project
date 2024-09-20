from pydantic import BaseModel


class SurverCreate(BaseModel):
    title: str
    description: str


class SurverUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
