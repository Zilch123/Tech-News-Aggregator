// src/App.jsx
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const BACKEND_URL = 'http://localhost:8000'; // Add this at the top
const TIME_PERIODS = [
  "last week",
  "last month",
  "last year",
  "last 3 years",
  "last 5 years",
  "all time"
];

const TOPICS = [
  "Front End coding",
  "BackEnd",
  "datascience",
  "Operating System",
  "OpenStreetMap",
  "Electronics",
  "Generative AI",
  "Mathematics"
];

const App = () => {
  const [topic, setTopic] = useState("");
  const [timePeriod, setTimePeriod] = useState("");
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!topic || !timePeriod) {
      setError("Please select both topic and time period");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${BACKEND_URL}/fetch_articles/?topic=${encodeURIComponent(topic)}&time_period=${encodeURIComponent(timePeriod)}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }

      const data = await response.json();
      setArticles(data.articles);
    } catch (err) {
      setError("Failed to fetch articles. Please try again.");
      setArticles([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
        Article Search
      </h1>
  
      {/* Horizontal Form Section */}
      <div className="form-row">
        {/* Topic Selector */}
        <div className="dropdown-container">
          <label className="dropdown-label" htmlFor="topic">
            Topic
          </label>
          <Select onValueChange={setTopic} value={topic}>
            <SelectTrigger id="topic" className="dropdown-trigger">
              <SelectValue placeholder="Select topic" />
            </SelectTrigger>
            <SelectContent className="dropdown-content">
              {TOPICS.map((t) => (
                <SelectItem key={t} value={t} className="dropdown-item">
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
  
        {/* Time Period Selector */}
        <div className="dropdown-container">
          <label className="dropdown-label" htmlFor="time-period">
            Time Period
          </label>
          <Select onValueChange={setTimePeriod} value={timePeriod}>
            <SelectTrigger id="time-period" className="dropdown-trigger">
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent className="dropdown-content">
              {TIME_PERIODS.map((t) => (
                <SelectItem key={t} value={t} className="dropdown-item">
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
  
        {/* Submit Button */}
        <div>
          <Button onClick={handleSearch} disabled={isLoading} className="submit-button">
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Searching...
              </span>
            ) : (
              "Search"
            )}
          </Button>
        </div>
      </div>
  
      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}
  
      {/* Results Section */}
      <div className="space-y-6">
        {articles.length > 0 ? (
          articles.map((article, index) => (
            <Card key={index} className="results-card">
              <CardContent className="results-card-content">
                <h2 className="font-bold text-xl text-gray-800 mb-3">{article.title}</h2>
                <p className="text-gray-600 mb-4">{article.summary}</p>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 underline"
                >
                  Read more
                </a>
                <div className="text-sm text-gray-500 mt-4">
                  Published on: {new Date(article.timestamp).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center text-gray-500">No articles found. Try a different search.</div>
        )}
      </div>
    </div>
  );
};

export default App;