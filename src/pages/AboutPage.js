// src/pages/AboutPage.js
import React from "react";

function AboutPage() {
  return (
    <div className="container about-page">
      <h1>Tentang AnimeList</h1>
      <p>
        Selamat datang di AnnimeList, platform pribadi Anda untuk melacak,
        menilai, dan mengulas anime favorit Anda. Kami dirancang untuk penggemar
        anime oleh penggemar anime.
      </p>
      <p>Dengan AnimeList, Anda bisa:</p>
      <ul>
        <li>Menemukan berbagai macam judul anime.</li>
        <li>Melacak anime yang sudah Anda tonton.</li>
        <li>Memberi rating dan ulasan pada anime.</li>
        <li>Melihat anime yang sedang tren dan populer.</li>
        <li>Berinteraksi dengan komunitas melalui fitur komentar.</li>
      </ul>
      <p>
        Proyek ini dibuat sebagai latihan pengembangan web, menggabungkan React
        sebagai frontend dan API backend untuk manajemen data.
      </p>
      <p>Terima kasih telah menggunakan AniList!</p>
      <p>
        <small>
          &copy; {new Date().getFullYear()} AnimeList. All rights reserved.
        </small>
      </p>
    </div>
  );
}

export default AboutPage;
