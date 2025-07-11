// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../api/api"; // Menggunakan instance axios kita

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Untuk menangani status loading saat inisialisasi

  useEffect(() => {
    // Cek token dan user dari localStorage saat aplikasi pertama kali dimuat
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post("/auth/login.php", {
        username,
        password,
      });
      const { user, token, message } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setIsAuthenticated(true);
      setUser(user);
      return { success: true, message };
    } catch (error) {
      console.error(
        "Login error:",
        error.response?.data?.message || error.message
      );
      return {
        success: false,
        message: error.response?.data?.message || "Login failed.",
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await api.post("/auth/register.php", {
        username,
        email,
        password,
      });
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error(
        "Register error:",
        error.response?.data?.message || error.message
      );
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed.",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  if (loading) {
    return <div>Loading authentication...</div>; // Atau spinner
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
