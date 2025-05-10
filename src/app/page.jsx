import Header from "@/Components/AnimeTrailer/Header";
import AnimeTrailer from "@/Components/AnimeTrailer";
import {
  getAnimeRespons,
  getNestedAnimeRespons,
  reproduce,
} from "@/libs/api-libs";
import { authUserSession } from "@/libs/auth-libs"; // ✅ Tambahkan ini
import About from "./About/about";

const Page = async () => {
  const user = await authUserSession(); // ✅ Cek login

  const topAnime = await getAnimeRespons("top/anime", "limit=8");
  let recomendedAnime = await getNestedAnimeRespons(
    "recommendations/anime",
    "entry"
  );

  recomendedAnime = reproduce(recomendedAnime, 8);

  return (
    <>
      {/* About hanya muncul jika belum login */}
      {!user && <About />}

      {/* anime terpopuler */}
      <section>
        <Header
          title="Paling Populer"
          linkTitle="Lihat Semua"
          linkHref="/populer"
        />
        <AnimeTrailer api={topAnime} />
      </section>

      {/* anime rekomendasi */}
      <section>
        <Header title="Rekomendasi" linkHref="/populer" />
        <AnimeTrailer api={recomendedAnime} />
      </section>
    </>
  );
};

export default Page;
