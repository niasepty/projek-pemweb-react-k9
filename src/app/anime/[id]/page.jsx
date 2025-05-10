import { getAnimeRespons } from "@/libs/api-libs";
import VidioPlayer from "@/Components/utilites/VidioPlayer";
import Image from "next/image";
import CollectionsButton from "@/Components/AnimeTrailer/CollectionsButton";
import { authUserSession } from "@/libs/auth-libs";
import prisma from "@/libs/prisma";
import CommentInput from "@/Components/AnimeTrailer/CommentInput";
import CommentBox from "@/Components/AnimeTrailer/commentBox";

const page = async ({ params: { id } }) => {
  const anime = await getAnimeRespons(`anime/${id}`);
  const user = await authUserSession();
  const collection = await prisma.collection.findFirst({
    where: { user_email: user?.email, anime_mal_id: id },
  });

  return (
    <>
      <div className="pt-4 px-4">
        <h3 className="text-xl ">
          {anime.data.title} - {anime.data.year}
        </h3>
        {!collection && user && (
          <CollectionsButton
            anime_mal_id={id}
            user_email={user?.email}
            anime_image={anime.data.images.webp.image_url}
            anime_title={anime.data.title}
          />
        )}
      </div>

      <div className="pt-4 px-4 flex gap-2  overflow-x-auto">
        <div className="w-34 flex flex-col justify-center items-center rounded border border-white p-2">
          <h3>PERINGKAT</h3>
          <p>{anime.data.rank}</p>
        </div>
        <div className="w-34 flex flex-col justify-center items-center rounded border border-white p-2">
          <h3>SKOR</h3>
          <p>{anime.data.score}</p>
        </div>
        <div className="w-34 flex flex-col justify-center items-center rounded border border-white p-2">
          <h3>ANGGOTA</h3>
          <p>{anime.data.members}</p>
        </div>
        <div className="w-34 flex flex-col justify-center items-center rounded border border-white p-2">
          <h3>EPISODE</h3>
          <p>{anime.data.episodes}</p>
        </div>
        <div className="w-34 h-34 flex flex-col justify-center items-center text-center rounded border border-white p-2">
          <h3>RATING</h3>
          <p>{anime.data.rating}</p>
        </div>
        <div className="w-34 h-34 flex flex-col justify-center items-center text-center rounded border border-white p-2">
          <h3>DURASI</h3>
          <p>{anime.data.duration}</p>
        </div>
      </div>

      <div className="pt-4 px-4 flex gap-2 sm:flex-nowrap flex-wrap">
        <Image
          src={anime.data.images.webp.image_url}
          alt={anime.data.title}
          width={250}
          height={250}
          className="w-full rounded object-cover"
        />
        <p className="text-justify text-xl">{anime.data.synopsis}</p>
      </div>
      <div className="p-4">
        <h3 className="text-2xl mb-2">Komentar penonton</h3>
        <CommentBox anime_mal_id={id} />
        {user && (
          <CommentInput
            anime_mal_id={id}
            user_email={user?.email}
            username={user?.name}
            anime_title={anime.data.title}
          />
        )}
      </div>
      <div>
        <VidioPlayer youtubeid={anime.data.trailer.youtube_id} />
      </div>
    </>
  );
};

export default page;
