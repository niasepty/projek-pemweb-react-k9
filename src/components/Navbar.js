// src/components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../App.css"; // Untuk styling

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        AnimeList
      </Link>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        {isAuthenticated ? (
          <>
            <Link to="/profile">Profile ({user?.username})</Link>
            <button
              onClick={logout}
              className="btn"
              style={{ marginLeft: "10px" }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
