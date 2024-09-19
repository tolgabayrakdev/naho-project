from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.routes import authentication_router
from . import model
from .database import engine


model.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = ["http://localhost:5173", "https://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router=authentication_router.router, prefix="/api/auth")


@app.get("/")
def read_root():
    return {"Hello": "World"}
