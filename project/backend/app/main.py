from fastapi import FastAPI, Query
from datetime import datetime, timedelta
from app.utils import fetch_articles
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/fetch_articles/")
async def fetch_articles_api(
    topic: str = Query(..., description="Specify a topic"),
    time_period: str = Query(..., description="Specify a time period"),
):
    articles = fetch_articles(topic, time_period)
    return {"topic": topic, "time_period": time_period, "articles": articles}
