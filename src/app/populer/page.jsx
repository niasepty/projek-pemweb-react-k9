"use client";

import React, { useEffect, useState } from "react";
import HeaderMenu from "@/Components/utilites/HeaderMenu";
import Pagination from "@/Components/utilites/Pagination";
import AnimeTrailer from "@/Components/AnimeTrailer";
import { getAnimeRespons } from "@/libs/api-libs";

const Page = () => {
  const [page, setPage] = useState(1);
  const [topAnime, setTopAnime] = useState([]);

  const fetchData = async () => {
    // const response = await fetch(
    //   `${process.env.NEXT_PUBLIC_API_BASE_URL}/top/anime?page=${page}`
    // );
    // const data = await response.json();
    const populerAnime = await getAnimeRespons("top/anime", `page=${page}`);

    setTopAnime(populerAnime);
  };
  useEffect(() => {
    fetchData();
  }, [page]);

  return (
    <>
      <HeaderMenu title={`ANIME TERPOPULER  #${page}`} />
      <AnimeTrailer api={topAnime} />
      <Pagination
        page={page}
        lastPage={topAnime?.pagination?.last_visible_page}
        setPage={setPage}
      />
    </>
  );
};

export default Page;
