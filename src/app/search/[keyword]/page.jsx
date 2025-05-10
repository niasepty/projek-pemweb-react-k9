import { getAnimeRespons } from "@/libs/api-libs";
import AnimeTrailer from "@/Components/AnimeTrailer";
import Header from "@/Components/AnimeTrailer/Header";

const Page = async ({ params }) => {
  const { keyword } = params;
  const decodeKeyword = decodeURI(keyword);

  const searchAnime = await getAnimeRespons("anime", `q=${decodeKeyword}`);

  return (
    <>
      <section>
        <Header
          title={`pencarian untuk ${decodeKeyword}...`}
          linkTitle="Lihat Semua "
          linkHref="/populer"
        />
        <AnimeTrailer api={searchAnime} />
      </section>
      {/* anime terbaru */}
    </>
  );
};
export default Page;
