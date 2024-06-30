// Body.js
import React, { useState } from 'react';
import { calculateMetrics } from '../api';
import Loader from './Loader'; 
import '../App.css';

const Body = () => {
  const [playlistLink, setPlaylistLink] = useState('');
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); 

  const handleInputChange = (e) => {
    setPlaylistLink(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
    try {
      const result = await calculateMetrics(playlistLink);
      setMetrics(result);
      setError(null); 
    } catch (error) {
      console.error('Error fetching playlist data:', error);
      setError('Error fetching playlist data. Please try again later.');
      setMetrics(null);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className={`container ${loading ? 'loading' : ''}`}>
      <h1>YouTube Playlist Length Calculator</h1>
      <form onSubmit={handleSubmit} className="form">
        <label htmlFor="playlistLink">Enter YouTube Playlist Link:</label>
        <input
          type="text"
          id="playlistLink"
          value={playlistLink}
          onChange={handleInputChange}
          placeholder="Paste YouTube Playlist Link..."
          required
        />
        <br />
        <button type="submit">Calculate Metrics</button>
      </form>

      
      {loading && <Loader />}

   
      {metrics && (
        <div id="results">
          <p><strong>Number of Videos:</strong> {metrics.videoCount}</p>
          <p><strong>Total Duration:</strong> {formatDuration(metrics.totalDuration)}</p>
          <p><strong>Average Duration:</strong> {formatDuration(metrics.averageDuration)}</p>
          <br />
          <h2>Length at Different Speeds:</h2>
          <p><strong>1.25x:</strong> {formatDuration(metrics.speedMetrics['1.25x'])}</p>
          <p><strong>1.50x:</strong> {formatDuration(metrics.speedMetrics['1.50x'])}</p>
          <p><strong>1.75x:</strong> {formatDuration(metrics.speedMetrics['1.75x'])}</p>
          <p><strong>2.00x:</strong> {formatDuration(metrics.speedMetrics['2.00x'])}</p>
        </div>
      )}

    
      {error && !loading && (
        <div className="error-message">{error}</div>
      )}
    </div>
  );
}


function formatDuration(seconds) {
  const roundedSeconds = Math.floor(seconds); // Round down to nearest whole number
  const hours = Math.floor(roundedSeconds / 3600);
  const minutes = Math.floor((roundedSeconds % 3600) / 60);
  const remainingSeconds = roundedSeconds % 60;

  if (hours !== 0) {
    return `${hours} hours ${minutes} mins ${remainingSeconds} seconds`;
  } else if (minutes !== 0) {
    return `${minutes} mins ${remainingSeconds} seconds`;
  } else {
    return `${remainingSeconds} seconds`;
  }
}

export default Body;
