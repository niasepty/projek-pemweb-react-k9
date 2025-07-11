// src/auth/LoginPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../App.css";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages
    const result = await login(username, password);
    if (result.success) {
      setMessage(result.message);
      setTimeout(() => navigate("/"), 1000); // Redirect to home on success
    } else {
      setMessage(result.message);
    }
  };

  return (
    <div className="container" style={{ maxWidth: "400px" }}>
      <h2>Login</h2>
      {message && (
        <div
          className={`alert ${
            message.includes("successful") ? "alert-success" : "alert-error"
          }`}
        >
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
