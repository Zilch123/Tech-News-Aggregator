import React, { useState } from 'react';
import SearchForm from './components/SearchForm';
import ArticleList from './components/ArticleList';

function App() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);

  const fetchArticles = async (topic, timePeriod) => {
    try {
      const response = await fetch(
        `/fetch_articles/?topic=${encodeURIComponent(topic)}&time_period=${encodeURIComponent(timePeriod)}`
      );
      if (!response.ok) throw new Error("Failed to fetch articles");
      const data = await response.json();
      setArticles(data.articles);
      setError(null);
    } catch (err) {
      setError(err.message);
      setArticles([]);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Article Fetcher</h1>
      <SearchForm onSearch={fetchArticles} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ArticleList articles={articles} />
    </div>
  );
}

export default App;
