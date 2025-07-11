// src/pages/HomePage.js

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import "../App.css";

const HomePage = () => {
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnimes = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get("/animes/read.php");
        if (response.data.records) {
          setAnimes(response.data.records);
        } else {
          setAnimes([]);
        }
      } catch (err) {
        console.error(
          "Error fetching animes:",
          err.response ? err.response.data : err.message
        );
        setError("Failed to load animes. Please try again later.");
        setAnimes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimes();
  }, []);

  if (loading) {
    return <div className="container">Loading Animes...</div>;
  }

  if (error) {
    return <div className="container alert alert-error">{error}</div>;
  }

  if (animes.length === 0) {
    return <div className="container">No animes found.</div>;
  }

  return (
    <div className="container">
      <h2>Top Animes</h2>
      <div className="anime-grid">
        {animes.map((anime) => (
          <div key={anime.anime_mal_id} className="anime-card">
            <Link to={`/anime/${anime.anime_mal_id}`}>
              <img src={anime.cover_image_url} alt={anime.title} />
              <div className="anime-card-info">
                <h3>{anime.title}</h3>
                <p>Genre: {anime.genre}</p>
                <p>Year: {anime.release_year}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
