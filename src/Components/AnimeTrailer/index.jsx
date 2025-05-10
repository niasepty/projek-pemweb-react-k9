import Image from "next/image";
import Link from "next/link";

const AnimeTrailer = ({ api }) => {
  // Pastikan data tersedia
  if (!api || !api.data || api.data.length === 0) {
    return <p className="text-center py-10">Anime tidak ditemukan.</p>;
  }

  return (
    <div className="grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-4 px-4">
      {api.data?.map((anime, index) => (
        <Link
          key={index} // ✅ Key ditambahkan
          href={`/anime/${anime.mal_id}`}
          className="cursor-pointer hover:text-rose-500 transition-all"
        >
          <Image
            src={anime.images?.webp?.image_url || "/fallback.jpg"} // ✅ Cek aman dan fallback
            alt={anime.title} // ✅ Alt disesuaikan
            width={350}
            height={350}
            className="w-full max-h-64 object-cover"
          />
          <h3 className="font-bold md:text-xl text-md p-4">{anime.title}</h3>
        </Link>
      ))}
    </div>
  );
};

export default AnimeTrailer;
