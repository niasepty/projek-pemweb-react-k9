import React from "react";

const About = () => {
  return (
    <div
      id="#tentang-kami"
      className="flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 py-20 px-4"
    >
      <div className="max-w-3xl w-full p-8 bg-white text-gray-800 text-lg rounded-xl shadow-md">
        {/* Judul Halaman */}
        <h1 className="text-4xl font-extrabold mb-6 text-center text-rose-600">
          Tentang Animeku
        </h1>

        {/* Deskripsi Umum */}
        <p className="mb-6">
          <strong>Animeku</strong> adalah platform bagi para penggemar anime
          yang ingin menemukan trailer terbaru dan ulasan anime secara lengkap.
          Kami hadir untuk membantu Anda menjelajahi dunia anime dengan lebih
          mudah dan menyenangkan.
        </p>

        {/* Fitur Utama */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-rose-500">
            Fitur Unggulan:
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Trailer Terbaru:</strong> Tonton cuplikan anime yang
              sedang atau akan tayang.
            </li>
            <li>
              <strong>Review Lengkap:</strong> Baca ulasan objektif tentang
              cerita, animasi, karakter, dan synopsis.
            </li>
            <li>
              <strong>Pencarian Cepat:</strong> Temukan anime favorit Anda
              dengan mudah melalui fitur search kami.
            </li>
          </ul>
        </section>

        {/* Kenapa Memilih Animeku */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-rose-500">
            Mengapa Memilih Animeku?
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Preview Sebelum Menonton:</strong> Menilai anime lewat
              trailer sebelum memutuskan menonton.
            </li>
            <li>
              <strong>Ulasan Profesional:</strong> Ditulis oleh tim yang
              berpengalaman di dunia anime.
            </li>
            <li>
              <strong>Desain User-Friendly:</strong> Antarmuka simpel dan nyaman
              digunakan.
            </li>
          </ul>
        </section>

        {/* Footer */}
        <footer className="border-t pt-4 text-sm text-center text-gray-500">
          <p>
            Baik Anda penggemar baru maupun lama, <strong>Animeku</strong> siap
            menemani perjalanan anime Anda. Temukan, tonton, dan nikmati anime
            dengan lebih baik!
          </p>
        </footer>
      </div>
    </div>
  );
};

export default About;
