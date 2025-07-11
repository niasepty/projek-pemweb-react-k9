// src/pages/ProfilePage.js

import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/api";
import "../App.css"; // Pastikan CSS Anda diimpor di sini

const ProfilePage = () => {
  const { isAuthenticated, user, logout, login } = useAuth();
  const navigate = useNavigate();

  // --- State untuk Favorite Animes (EXISTING) ---
  const [favoriteAnimes, setFavoriteAnimes] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const [error, setError] = useState(null);

  // --- State Baru untuk Profile Data dan Update Form ---
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    created_at: "",
  });
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState(null);
  const [profileMessage, setProfileMessage] = useState(null);

  // --- State Baru untuk mengontrol visibilitas form update ---
  const [showUpdateForm, setShowUpdateForm] = useState(false); // Default: sembunyikan form

  // --- Fungsi untuk Mengambil Data Profil Pengguna (EXISTING) ---
  const fetchUserProfile = useCallback(async () => {
    setLoadingProfile(true);
    setProfileError(null);
    try {
      const response = await api.get("/users/read_one.php");
      setProfileData({
        username: response.data.username,
        email: response.data.email,
        created_at: response.data.created_at,
      });
    } catch (err) {
      console.error(
        "Error fetching user profile:",
        err.response ? err.response.data : err.message
      );
      setProfileError("Gagal memuat detail profil.");
    } finally {
      setLoadingProfile(false);
    }
  }, []);

  // --- Fungsi untuk Mengambil Daftar Anime Favorit (EXISTING) ---
  const fetchFavorites = useCallback(async () => {
    setLoadingFavorites(true);
    setError(null);
    try {
      const response = await api.get("/favorites/get.php");
      if (response.data.favorites && response.data.favorites.length > 0) {
        const detailedFavoritesPromises = response.data.favorites.map(
          async (malId) => {
            try {
              const animeDetailResponse = await api.get(
                `/animes/read_one.php?anime_mal_id=${malId}`
              );
              return animeDetailResponse.data;
            } catch (detailError) {
              console.error(
                `Error fetching detail for anime_mal_id ${malId}:`,
                detailError.response
                  ? detailError.response.data
                  : detailError.message
              );
              return null;
            }
          }
        );
        const resolvedFavorites = await Promise.all(detailedFavoritesPromises);
        setFavoriteAnimes(resolvedFavorites.filter((anime) => anime !== null));
      } else {
        setFavoriteAnimes([]);
      }
    } catch (err) {
      console.error(
        "Error fetching favorites list:",
        err.response ? err.response.data : err.message
      );
      setError("Gagal memuat daftar anime favorit.");
      setFavoriteAnimes([]);
    } finally {
      setLoadingFavorites(false);
    }
  }, []);

  // --- useEffect untuk Inisialisasi Data (EXISTING) ---
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      fetchUserProfile();
      fetchFavorites();
    }
  }, [isAuthenticated, navigate, fetchUserProfile, fetchFavorites]);

  // --- Fungsi untuk Menangani Perubahan Input Form Profil (EXISTING) ---
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // --- Fungsi untuk Menangani Submit Form Update Profil (EXISTING) ---
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);
    setProfileError(null);
    setProfileMessage(null);

    if (newPassword && newPassword !== confirmNewPassword) {
      setProfileError("Kata sandi baru dan konfirmasi tidak cocok.");
      setLoadingProfile(false);
      return;
    }

    const payload = {
      username: profileData.username,
      email: profileData.email,
    };

    if (newPassword) {
      payload.password = newPassword;
    }

    try {
      const response = await api.put("/users/update.php", payload);
      setProfileMessage(response.data.message || "Profil berhasil diperbarui!");

      if (response.data.jwt) {
        login({
          ...user,
          token: response.data.jwt,
          username: profileData.username,
          email: profileData.email,
        });
      } else {
        login({
          ...user,
          username: profileData.username,
          email: profileData.email,
        });
      }

      setNewPassword("");
      setConfirmNewPassword("");

      // Setelah berhasil update, sembunyikan kembali form
      setShowUpdateForm(false); // <--- SEMBUNYIKAN FORM SETELAH BERHASIL
    } catch (err) {
      console.error(
        "Error updating profile:",
        err.response ? err.response.data : err.message
      );
      setProfileError(
        err.response?.data?.message || "Gagal memperbarui profil."
      );
    } finally {
      setLoadingProfile(false);
    }
  };

  // --- Kondisi Loading/Error Awal ---
  if (!isAuthenticated || !user) {
    return <div className="container">Redirecting to login...</div>;
  }

  if (loadingProfile || loadingFavorites) {
    return <div className="container">Loading profile and favorites...</div>;
  }

  // --- Render Komponen ---
  return (
    <div className="container profile-page">
      {/* Bagian Informasi Profil Dasar (SELALU TERLIHAT) */}
      <h2>Selamat Datang, {user.username}!</h2>
      <p>Email Anda: {user.email}</p>
      <p>
        Bergabung Sejak: {new Date(profileData.created_at).toLocaleDateString()}
      </p>
      <div className="profile-actions">
        {/* Tombol Logout */}
        <button onClick={logout} className="btn btn-primary">
          Logout
        </button>
        {/* Tombol untuk membuka/menutup form update */}
        <button
          onClick={() => setShowUpdateForm(!showUpdateForm)}
          className="btn btn-secondary" // Anda bisa menambahkan style untuk btn-secondary di CSS Anda
        >
          {showUpdateForm ? "Batal Perbarui Profil" : "Perbarui Profil"}
        </button>
      </div>
      {/* --- Bagian Update Profil (HANYA MUNCUL JIKA showUpdateForm TRUE) --- */}
      {showUpdateForm && ( // <--- KONDISI RENDERING DI SINI
        <>
          <h3 style={{ marginTop: "40px", marginBottom: "20px" }}>
            Perbarui Profil Anda
          </h3>
          <form onSubmit={handleProfileSubmit} className="profile-update-form">
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={profileData.username}
                onChange={handleProfileChange}
                required
                disabled={loadingProfile}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={profileData.email}
                onChange={handleProfileChange}
                required
                disabled={loadingProfile}
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">
                Kata Sandi Baru (kosongkan jika tidak ingin diubah):
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loadingProfile}
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmNewPassword">
                Konfirmasi Kata Sandi Baru:
              </label>
              <input
                type="password"
                id="confirmNewPassword"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                disabled={loadingProfile}
              />
            </div>

            {profileError && (
              <div className="alert alert-danger">{profileError}</div>
            )}
            {profileMessage && (
              <div className="alert alert-success">{profileMessage}</div>
            )}

            <button
              type="submit"
              className="btn btn-success"
              disabled={loadingProfile}
            >
              {loadingProfile ? "Memperbarui..." : "Perbarui Profil"}
            </button>
          </form>
        </>
      )}
      {/* --- Bagian Favorite Animes (EXISTING) --- */}
      <h3 style={{ marginTop: "40px" }}>Anime Favorit Anda:</h3>
      {error && <div className="alert alert-error">{error}</div>}{" "}
      {/* Error untuk favorites */}
      {favoriteAnimes.length > 0 ? (
        <div className="anime-grid">
          {favoriteAnimes.map((anime) => (
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
      ) : (
        <p>Anda belum punya anime favorit.</p>
      )}
    </div>
  );
};

export default ProfilePage;
