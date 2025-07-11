// src/components/AnimeComments.jsx
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext"; // Pastikan path ini benar
import "./AnimeComments.css"; // Opsional, untuk styling

const API_BASE_URL = "http://localhost/ANIMELIST-API/api"; // Pastikan ini sesuai dengan URL API PHP Anda

const AnimeComments = ({ animeMalId }) => {
  const { user } = useContext(AuthContext);

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newCommentText, setNewCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null); // State untuk ID komentar yang sedang diedit
  const [editingCommentText, setEditingCommentText] = useState(""); // State untuk teks komentar yang sedang diedit

  // Fungsi untuk mengambil (fetch) komentar dari backend
  const fetchComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_BASE_URL}/comments/get.php?anime_mal_id=${animeMalId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data.comments) {
        setComments(data.comments);
      } else {
        setComments([]);
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (animeMalId) {
      fetchComments();
    }
  }, [animeMalId]);

  // Fungsi untuk menambah komentar (tetap disertakan agar fitur komentar lengkap)
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user || !user.token) {
      alert("Anda harus login untuk menambahkan komentar.");
      return;
    }
    if (!newCommentText.trim()) {
      alert("Komentar tidak boleh kosong.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/comments/add.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          anime_mal_id: animeMalId,
          comment_text: newCommentText,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal menambahkan komentar.");
      }

      setNewCommentText("");
      await fetchComments();
    } catch (err) {
      console.error("Error adding comment:", err);
      setError(err.message);
      alert(`Error menambahkan komentar: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk memulai mode edit sebuah komentar
  const handleEditClick = (comment) => {
    setEditingCommentId(comment.id);
    setEditingCommentText(comment.comment_text); // Isi form edit dengan teks komentar saat ini
  };

  // Fungsi untuk membatalkan mode edit
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingCommentText("");
  };

  // Fungsi untuk menangani update komentar
  const handleUpdateComment = async (e) => {
    e.preventDefault();
    if (!user || !user.token) {
      alert("Anda harus login untuk memperbarui komentar.");
      return;
    }
    if (!editingCommentText.trim()) {
      alert("Komentar tidak boleh kosong.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/comments/update.php`, {
        method: "PUT", // Menggunakan metode PUT untuk update
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          comment_id: editingCommentId, // Kirim ID komentar yang diedit
          comment_text: editingCommentText, // Kirim teks komentar yang baru
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal memperbarui komentar.");
      }

      setEditingCommentId(null); // Keluar dari mode edit
      setEditingCommentText(""); // Bersihkan form edit
      await fetchComments(); // Ambil ulang komentar untuk menampilkan perubahan
    } catch (err) {
      console.error("Error updating comment:", err);
      setError(err.message);
      alert(`Error memperbarui komentar: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk menghapus komentar (tetap disertakan agar fitur komentar lengkap)
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus komentar ini?")) {
      return;
    }
    if (!user || !user.token) {
      alert("Anda harus login untuk menghapus komentar.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/comments/delete.php`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          comment_id: commentId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal menghapus komentar.");
      }

      await fetchComments();
    } catch (err) {
      console.error("Error deleting comment:", err);
      setError(err.message);
      alert(`Error menghapus komentar: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="anime-comments-section">
      <h3>Komentar</h3>

      {/* Form untuk menambahkan komentar (hanya jika user login) */}
      {user ? (
        <form onSubmit={handleAddComment} className="comment-form">
          <textarea
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="Tambahkan komentar Anda..."
            rows="4"
            required
            disabled={loading}
          ></textarea>
          <button type="submit" disabled={loading}>
            {loading ? "Mengirim..." : "Kirim Komentar"}
          </button>
        </form>
      ) : (
        <p>
          Silakan <a href="/login">login</a> untuk menambahkan komentar.
        </p>
      )}

      {loading && <p>Memuat komentar...</p>}
      {error && <p className="error-message">Error: {error}</p>}

      {/* Daftar Komentar */}
      <div className="comment-list">
        {comments.length > 0
          ? comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <p className="comment-author">
                  <strong>
                    {comment.username || "Pengguna Tidak Dikenal"}
                  </strong>{" "}
                  pada {new Date(comment.created_at).toLocaleString()}
                </p>

                {/* Kondisional rendering untuk mode edit atau tampilan normal */}
                {editingCommentId === comment.id ? (
                  <form
                    onSubmit={handleUpdateComment}
                    className="edit-comment-form"
                  >
                    <textarea
                      value={editingCommentText}
                      onChange={(e) => setEditingCommentText(e.target.value)}
                      rows="3"
                      required
                      disabled={loading}
                    ></textarea>
                    <div className="edit-buttons">
                      <button type="submit" disabled={loading}>
                        Update
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        disabled={loading}
                      >
                        Batal
                      </button>
                    </div>
                  </form>
                ) : (
                  <p className="comment-text">{comment.comment_text}</p>
                )}

                {/* Tombol Edit/Hapus hanya muncul jika user login DAN komentar miliknya DAN tidak dalam mode edit */}
                {user &&
                  user.id === comment.user_id &&
                  editingCommentId !== comment.id && (
                    <div className="comment-actions">
                      <button
                        onClick={() => handleEditClick(comment)}
                        disabled={loading}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        disabled={loading}
                      >
                        Hapus
                      </button>
                    </div>
                  )}
              </div>
            ))
          : !loading && <p>Belum ada komentar untuk anime ini.</p>}
      </div>
    </div>
  );
};

export default AnimeComments;
