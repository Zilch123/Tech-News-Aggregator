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
  "UX UI design",
  "Opensource",
  "BackEnd",
  "datascience",
  "Operating System",
  "OpenStreetMap",
  "Electronics",
  "Comic",
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
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Article Search</h1>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block mb-2">Topic</label>
          <Select onValueChange={setTopic} value={topic}>
            <SelectTrigger>
              <SelectValue placeholder="Select topic" />
            </SelectTrigger>
            <SelectContent>
              {TOPICS.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block mb-2">Time Period</label>
          <Select onValueChange={setTimePeriod} value={timePeriod}>
            <SelectTrigger>
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              {TIME_PERIODS.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleSearch}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Searching..." : "Search"}
        </Button>
      </div>

      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}

      <div className="space-y-4">
        {articles.map((article, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <h2 className="font-semibold mb-2">{article.title}</h2>
              <p className="text-gray-600 mb-2">{article.summary}</p>
              <a 
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Read more
              </a>
              <div className="text-sm text-gray-500 mt-2">
                {new Date(article.timestamp).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default App;