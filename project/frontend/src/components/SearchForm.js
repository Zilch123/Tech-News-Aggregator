import React, { useState } from 'react';

function SearchForm({ onSearch }) {
  const [topic, setTopic] = useState('');
  const [timePeriod, setTimePeriod] = useState('last week');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(topic, timePeriod);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <div>
        <label>
          Topic: 
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter topic"
            required
          />
        </label>
      </div>
      <div>
        <label>
          Time Period: 
          <select value={timePeriod} onChange={(e) => setTimePeriod(e.target.value)}>
            <option value="last week">Last Week</option>
            <option value="last month">Last Month</option>
            <option value="last year">Last Year</option>
            <option value="last 3 years">Last 3 Years</option>
            <option value="last 5 years">Last 5 Years</option>
            <option value="all time">All Time</option>
          </select>
        </label>
      </div>
      <button type="submit" style={{ marginTop: '10px' }}>Search</button>
    </form>
  );
}

export default SearchForm;
