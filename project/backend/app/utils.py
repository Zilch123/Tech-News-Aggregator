#!/usr/bin/env python3.11
# utils.py
import yaml
import platform
import feedparser
from datetime import datetime, timedelta
import os
from pathlib import Path
import logging
from concurrent.futures import ThreadPoolExecutor
from dateutil import parser as date_parser

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ArticleFetcher:
    def __init__(self, config_path: str = None):
        # Resolve the default config path relative to the script
        if config_path is None:
            config_path = Path(__file__).parent / "config/rss_feeds.yaml"
        self.config_path = str(config_path)
        self.feeds_config = self._load_config()
        
    def _load_config(self) -> dict:
        """Load RSS feed configuration from YAML file."""
        try:
            config_path = Path(self.config_path)
            if not config_path.exists():
                raise FileNotFoundError(f"Config file not found: {self.config_path}")
                
            with open(config_path, 'r') as file:
                return yaml.safe_load(file)
        except Exception as e:
            logger.error(f"Error loading config: {str(e)}")
            return {"feeds": {}}

    def _parse_time_period(self, time_period: str) -> datetime:
        """Convert time period string to datetime cutoff."""
        now = datetime.now()
        time_map = {
            "last week": now - timedelta(weeks=1),
            "last month": now - timedelta(days=30),
            "last year": now - timedelta(days=365),
            "last 3 years": now - timedelta(days=365 * 3),
            "last 5 years": now - timedelta(days=365 * 5),
            "all time": datetime.min
        }
        return time_map.get(time_period, now)

    def _fetch_feed(self, feed_info: dict) -> list[dict]:
        """Fetch and parse a single RSS feed."""
        try:
            feed = feedparser.parse(feed_info['url'])
            articles = []
            
            for entry in feed.entries:
                # Extract and format article data
                try:
                    # Try to parse the published date
                    if hasattr(entry, 'published'):
                        timestamp = date_parser.parse(entry.published)
                        timestamp = timestamp.replace(tzinfo=None)
                    elif hasattr(entry, 'updated'):
                        timestamp = date_parser.parse(entry.updated)
                        timestamp = timestamp.replace(tzinfo=None)
                    else:
                        continue  # Skip if no timestamp available
                    
                    article = {
                        "title": entry.title,
                        "summary": entry.get('summary', ''),
                        "url": entry.link,
                        "timestamp": timestamp.isoformat()
                    }
                    articles.append(article)
                except Exception as e:
                    logger.warning(f"Error processing entry from {feed_info['url']}: {str(e)}")
                    continue
                    
            return articles
        except Exception as e:
            logger.error(f"Error fetching feed {feed_info['url']}: {str(e)}")
            return []

    def fetch_articles(self, topic: str, time_period: str) -> list[dict[str, any]]:
        """
        Fetch articles for given topic and time period.
        
        Args:
            topic (str): Topic to fetch articles for
            time_period (str): Time period to filter articles
            
        Returns:
            List[Dict]: List of articles with title, summary, url, and timestamp
        """
        # Validate inputs
        if topic not in self.feeds_config['feeds']:
            logger.warning(f"No feeds configured for topic: {topic}")
            return []
            
        cutoff_date = self._parse_time_period(time_period)
        feeds = self.feeds_config['feeds'][topic]
        
        # Fetch feeds in parallel
        all_articles = []
        with ThreadPoolExecutor(max_workers=5) as executor:
            article_lists = list(executor.map(self._fetch_feed, feeds))
            for articles in article_lists:
                all_articles.extend(articles)
        
        # Filter articles by date
        filtered_articles = []
        for article in all_articles:
            try:
                article_date = datetime.fromisoformat(article['timestamp']).replace(tzinfo=None)
                if article_date >= cutoff_date:
                    filtered_articles.append(article)
            except Exception as e:
                logger.warning(f"Error processing article date: {str(e)}")
                continue
        
        # Sort by timestamp (newest first)
        filtered_articles.sort(key=lambda x: x['timestamp'], reverse=True)
        
        return filtered_articles

def fetch_articles(topic: str, time_period: str) -> list[dict[str, any]]:
    """
    Wrapper function for the ArticleFetcher class.
    """
    fetcher = ArticleFetcher()
    return fetcher.fetch_articles(topic, time_period)