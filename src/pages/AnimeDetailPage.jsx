// src/pages/AnimeDetailPage.js
import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/api";
import "../App.css";

const AnimeDetailPage = () => {
  const { animeMalId } = useParams();
  const { isAuthenticated, user } = useAuth();

  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [commentMessage, setCommentMessage] = useState("");
  const [rating, setRating] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
  const [userScore, setUserScore] = useState("");
  const [ratingMessage, setRatingMessage] = useState("");
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteMessage, setFavoriteMessage] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(
          `/animes/read_one.php?anime_mal_id=${animeMalId}`
        );
        setAnime(response.data);
      } catch (err) {
        console.error(
          "Error fetching anime details:",
          err.response?.data || err.message
        );
        setError("Failed to load anime details. Anime not found or API error.");
        setAnime(null);
      } finally {
        setLoading(false);
      }
    };
    fetchAnimeDetails();
  }, [animeMalId]);

  const fetchComments = useCallback(async () => {
    try {
      const response = await api.get(
        `/comments/get.php?anime_mal_id=${animeMalId}`
      );
      if (response.data.comments) {
        setComments(response.data.comments);
      } else {
        setComments([]);
      }
    } catch (error) {
      console.error(
        "Error fetching comments:",
        error.response?.data || error.message
      );
      setComments([]);
    }
  }, [animeMalId]);

  useEffect(() => {
    fetchComments(); // Sudah diperbaiki
  }, [fetchComments]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    console.log("🚀 Form submit dimulai...");

    if (!isAuthenticated) {
      console.warn("⚠️ Gagal: Pengguna belum login.");
      setCommentMessage("You must be logged in to comment.");
      return;
    }

    if (newCommentText.trim() === "") {
      console.warn("⚠️ Gagal: Komentar kosong.");
      setCommentMessage("Comment cannot be empty.");
      return;
    }

    try {
      console.log("📤 Mengirim komentar ke server:", {
        anime_mal_id: animeMalId,
        comment_text: newCommentText,
      });

      const response = await api.post("/comments/add.php", {
        anime_mal_id: animeMalId,
        comment_text: newCommentText,
      });

      console.log(
        "✅ Komentar berhasil dikirim. Respons dari server:",
        response.data
      );

      setCommentMessage(response.data.message);
      setNewCommentText("");
      fetchComments();
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message;
      console.error("❌ Gagal mengirim komentar. Pesan error:", errMsg);
      setCommentMessage(errMsg);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;
    try {
      const response = await api.post("/comments/delete.php", {
        comment_id: commentId,
      });
      setCommentMessage(response.data.message);
      fetchComments();
    } catch (error) {
      console.error(
        "Error deleting comment:",
        error.response?.data?.message || error.message
      );
      setCommentMessage(
        error.response?.data?.message || "Failed to delete comment."
      );
    }
  };

  const handleEditClick = (commentId, currentText) => {
    setEditingCommentId(commentId);
    setEditingCommentText(currentText);
  };

  const handleUpdateComment = async (e) => {
    e.preventDefault();
    if (editingCommentText.trim() === "") {
      setCommentMessage("Comment cannot be empty.");
      return;
    }
    try {
      const response = await api.post("/comments/update.php", {
        comment_id: editingCommentId,
        comment_text: editingCommentText,
      });
      setCommentMessage(response.data.message);
      setEditingCommentId(null);
      setEditingCommentText("");
      fetchComments();
    } catch (error) {
      console.error(
        "Error updating comment:",
        error.response?.data?.message || error.message
      );
      setCommentMessage(
        error.response?.data?.message || "Failed to update comment."
      );
    }
  };

  const fetchRatings = useCallback(async () => {
    try {
      const avgResponse = await api.get(
        `/ratings/get_average.php?anime_mal_id=${animeMalId}`
      );
      setAverageRating(avgResponse.data.average_score ?? 0);

      if (isAuthenticated && user) {
        const userRatingResponse = await api.get(
          `/ratings/get_user_rating.php?anime_mal_id=${animeMalId}`
        );
        const score = userRatingResponse.data.score;
        setRating(score);
        setUserScore(score !== null ? score.toString() : "");
      } else {
        setRating(null);
        setUserScore("");
      }
    } catch (error) {
      console.error(
        "Error fetching ratings:",
        error.response?.data || error.message
      );
      setAverageRating(null);
      setRating(null);
    }
  }, [animeMalId, isAuthenticated, user]);

  useEffect(() => {
    fetchRatings();
  }, [fetchRatings]);

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setRatingMessage("You must be logged in to rate.");
      return;
    }

    const scoreNum = parseFloat(userScore);
    if (isNaN(scoreNum) || scoreNum < 1 || scoreNum > 10) {
      setRatingMessage("Score must be a number between 1 and 10.");
      return;
    }

    try {
      const response = await api.post("/ratings/add.php", {
        anime_mal_id: animeMalId,
        score: scoreNum,
      });
      setRatingMessage(response.data.message);
      fetchRatings();
    } catch (error) {
      console.error(
        "Error rating:",
        error.response?.data?.message || error.message
      );
      setRatingMessage(
        error.response?.data?.message || "Failed to submit rating."
      );
    }
  };

  const checkFavoriteStatus = useCallback(async () => {
    if (!isAuthenticated) {
      setIsFavorited(false);
      return;
    }
    try {
      const response = await api.get(
        `/favorites/get.php?anime_mal_id=${animeMalId}`
      );
      setIsFavorited(response.data.favorited);
    } catch (error) {
      console.error(
        "Error checking favorite status:",
        error.response?.data || error.message
      );
      setIsFavorited(false);
    }
  }, [animeMalId, isAuthenticated]);

  useEffect(() => {
    checkFavoriteStatus();
  }, [checkFavoriteStatus]);

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      setFavoriteMessage("You must be logged in to favorite an anime.");
      return;
    }
    try {
      const response = await api.post("/favorites/add_remove.php", {
        anime_mal_id: animeMalId,
      });
      setIsFavorited(response.data.favorited);
      setFavoriteMessage(response.data.message);
      setTimeout(() => setFavoriteMessage(""), 3000);
    } catch (error) {
      console.error(
        "Error toggling favorite:",
        error.response?.data?.message || error.message
      );
      setFavoriteMessage(
        error.response?.data?.message || "Failed to toggle favorite."
      );
    }
  };

  if (loading) return <div className="container">Loading Anime Details...</div>;
  if (error) return <div className="container alert alert-error">{error}</div>;
  if (!anime) return <div className="container">Anime not found.</div>;

  return (
    <div className="container">
      <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
        <img
          src={anime.cover_image_url}
          alt={anime.title}
          style={{
            width: "300px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        />
        <div>
          <h1>
            {anime.title}
            {isAuthenticated && (
              <button
                onClick={handleFavoriteToggle}
                className={`favorite-toggle ${isFavorited ? "favorited" : ""}`}
                title={
                  isFavorited ? "Remove from Favorites" : "Add to Favorites"
                }
                style={{ marginLeft: "10px" }}
              >
                {isFavorited ? "★" : "☆"}
              </button>
            )}
          </h1>

          {favoriteMessage && (
            <div
              className={`alert ${
                favoriteMessage.includes("berhasil")
                  ? "alert-success"
                  : "alert-error"
              }`}
            >
              {favoriteMessage}
            </div>
          )}

          <p>
            <strong>Genre:</strong> {anime.genre}
          </p>
          <p>
            <strong>Release Year:</strong> {anime.release_year}
          </p>
          <p>{anime.description}</p>

          <div className="rating-section">
            <h3>Ratings</h3>
            {averageRating !== null ? (
              <p>
                Average Score: <strong>{averageRating.toFixed(1)}</strong> / 10
              </p>
            ) : (
              <p>No ratings yet.</p>
            )}

            {isAuthenticated ? (
              <form onSubmit={handleRatingSubmit} style={{ marginTop: "15px" }}>
                <div className="form-group">
                  <label htmlFor="score">Your Score (1-10):</label>
                  <input
                    type="number"
                    id="score"
                    value={userScore}
                    onChange={(e) => setUserScore(e.target.value)}
                    min="1"
                    max="10"
                    step="0.1"
                    required
                    style={{ width: "100px" }}
                  />
                </div>
                <button type="submit" className="btn">
                  {rating !== null ? "Update My Rating" : "Add My Rating"}
                </button>
                {ratingMessage && (
                  <div
                    className={`alert ${
                      ratingMessage.includes("success")
                        ? "alert-success"
                        : "alert-error"
                    }`}
                  >
                    {ratingMessage}
                  </div>
                )}
                {rating !== null && (
                  <p style={{ marginTop: "10px" }}>
                    You rated: <strong>{rating}</strong>
                  </p>
                )}
              </form>
            ) : (
              <p>Login to add your rating!</p>
            )}
          </div>
        </div>
      </div>

      <div className="comments-section">
        <h3>Comments</h3>
        {isAuthenticated ? (
          <form onSubmit={handleCommentSubmit} style={{ marginBottom: "20px" }}>
            <div className="form-group">
              <label htmlFor="comment">Add a Comment:</label>
              <textarea
                id="comment"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                rows="4"
                required
              ></textarea>
            </div>
            <button type="submit" className="btn">
              Post Comment
            </button>
            {commentMessage && (
              <div
                className={`alert ${
                  commentMessage.includes("added")
                    ? "alert-success"
                    : "alert-error"
                }`}
              >
                {commentMessage}
              </div>
            )}
          </form>
        ) : (
          <p>Login to post a comment!</p>
        )}

        <div className="comment-list">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <strong>{comment.username}</strong>
                <small>{new Date(comment.created_at).toLocaleString()}</small>

                {editingCommentId === comment.id ? (
                  <form onSubmit={handleUpdateComment}>
                    <textarea
                      value={editingCommentText}
                      onChange={(e) => setEditingCommentText(e.target.value)}
                      rows="3"
                      required
                    ></textarea>
                    <button type="submit" className="btn btn-small">
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn btn-small btn-secondary"
                      onClick={() => setEditingCommentId(null)}
                      style={{ marginLeft: "5px" }}
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <p>{comment.comment_text}</p>
                )}

                {isAuthenticated && user && user.id === comment.user_id && (
                  <div className="comment-actions">
                    <button
                      className="btn btn-small"
                      onClick={() =>
                        handleEditClick(comment.id, comment.comment_text)
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-small btn-danger"
                      onClick={() => handleDeleteComment(comment.id)}
                      style={{ marginLeft: "5px" }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No comments yet. Be the first to comment!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnimeDetailPage;
