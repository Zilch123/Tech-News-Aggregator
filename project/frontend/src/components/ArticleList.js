import React from 'react';

function ArticleList({ articles }) {
  if (articles.length === 0) {
    return <p>No articles found.</p>;
  }

  return (
    <ul>
      {articles.map((article, index) => (
        <li key={index} style={{ marginBottom: '10px' }}>
          <h3>{article.title}</h3>
          <p>{article.summary}</p>
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            Read More
          </a>
          <p style={{ fontSize: '0.8em', color: 'gray' }}>
            Published: {new Date(article.timestamp).toLocaleDateString()}
          </p>
        </li>
      ))}
    </ul>
  );
}

export default ArticleList;
