from fastapi import FastAPI
from .api import qa
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="AI Inference API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://vn-law-bot-hoanglvuits-projects.vercel.app"],  # Cho phép mọi domain và cổng
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(qa.router, prefix="", tags=["AI"])