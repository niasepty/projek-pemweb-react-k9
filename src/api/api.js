// src/api/api.js

import axios from "axios";

const api = axios.create({
  // GANTI BASEURL INI SESUAI DENGAN LOKASI FOLDER 'api' DI SERVER PHP ANDA
  baseURL: "http://localhost/ANIMELIST-API/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor untuk menambahkan token Authorization
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
