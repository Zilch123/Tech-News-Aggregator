from datetime import datetime, timedelta
import random

# Mock database
MOCK_ARTICLES = [
    {"title": f"Article on {topic}", 
     "summary": "This is a summary.", 
     "url": f"https://example.com/{topic.lower()}", 
     "timestamp": (datetime.now() - timedelta(days=random.randint(0, 365 * 5))).isoformat()}
    for topic in [
        "Front End coding", "UX UI design", "Opensource", "BackEnd",
        "datascience", "Operating System", "OpenStreetMap", "Electronics",
        "Comic", "Generative AI", "Mathematics"
    ]
]

def fetch_articles(topic: str, time_period: str):
    time_map = {
        "last week": datetime.now() - timedelta(weeks=1),
        "last month": datetime.now() - timedelta(days=30),
        "last year": datetime.now() - timedelta(days=365),
        "last 3 years": datetime.now() - timedelta(days=365 * 3),
        "last 5 years": datetime.now() - timedelta(days=365 * 5),
        "all time": datetime.min,
    }
    cutoff_date = time_map[time_period]
    return [article for article in MOCK_ARTICLES if article["timestamp"] >= cutoff_date.isoformat()]
