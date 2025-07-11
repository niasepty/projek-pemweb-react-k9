// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import AnimeDetailPage from "./pages/AnimeDetailPage";
import LoginPage from "./auth/LoginPage";
import RegisterPage from "./auth/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import AboutPage from "./pages/AboutPage"; // Import AboutPage
import "./App.css";

// Komponen helper untuk rute yang dilindungi
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // Pastikan status autentikasi sudah diketahui.
  // Ini penting agar tidak langsung me-redirect sebelum status token diverifikasi.
  // Jika isAuthenticated adalah null, berarti proses pengecekan token masih berlangsung.
  if (isAuthenticated === null) {
    return <div>Loading authentication status...</div>; // Tampilkan pesan loading
  }

  // Jika terautentikasi, tampilkan children (komponen yang dilindungi)
  // Jika tidak, redirect ke halaman login
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      {" "}
      {/* Membungkus seluruh aplikasi untuk menyediakan konteks autentikasi */}
      <Router>
        {" "}
        {/* Mengaktifkan routing di aplikasi */}
        <div className="App">
          <Navbar /> {/* Navbar akan selalu muncul di setiap halaman */}
          <main>
            {" "}
            {/* Konten utama halaman */}
            <Routes>
              {" "}
              {/* Tempat definisi semua rute aplikasi */}
              {/* Rute publik */}
              <Route path="/" element={<HomePage />} />
              {/* Rute ini sudah benar dengan parameter :animeMalId */}
              <Route path="/anime/:animeMalId" element={<AnimeDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/about" element={<AboutPage />} />{" "}
              {/* Rute baru untuk AboutPage */}
              {/* Rute yang dilindungi (hanya bisa diakses jika sudah login) */}
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    {" "}
                    {/* Menggunakan komponen PrivateRoute */}
                    <ProfilePage />
                  </PrivateRoute>
                }
              />
              {/* Rute fallback (jika URL tidak cocok dengan rute di atas, redirect ke home) */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
