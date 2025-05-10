import Link from "next/link";
import Image from "next/image";
import Header from "@/Components/Dashboard/Header";
import { authUserSession } from "@/libs/auth-libs";
import prisma from "@/libs/prisma";

const page = async () => {
  const user = await authUserSession();
  const collection = await prisma.collection.findMany({
    where: { user_email: user?.email },
  });
  console.log({ collection });

  return (
    <section className="mt-4 px-4 w-full">
      <Header title={"My collections"} />

      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {collection.map((collect, index) => (
          <Link
            key={index}
            href={`/anime/${collect.anime_mal_id}`}
            className="relative text-black"
          >
            <Image
              src={collect.anime_image}
              alt={collect.anime_title}
              width={350}
              height={350}
              className="w-full h-auto object-cover"
            />
            <div className="absolute flex items-center justify-center bottom-0 w-full bg-rose-500 h-16">
              <h5 className="text-sm md:text-base text-white text-center px-2">
                {collect.anime_title}
              </h5>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default page;
