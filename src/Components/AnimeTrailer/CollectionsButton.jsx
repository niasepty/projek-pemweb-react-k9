"use client";
import React, { useState } from "react";

const CollectionsButton = ({
  anime_mal_id,
  user_email,
  anime_image,
  anime_title,
}) => {
  const [isCreated, setIsCreated] = useState(false);

  const handleCollection = async (event) => {
    event.preventDefault();
    const data = { anime_mal_id, user_email, anime_image, anime_title };

    try {
      const response = await fetch("/api/v1/collection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const text = await response.text();
      const collection = text ? JSON.parse(text) : {};
      console.log("Collection result:", collection);

      if (collection.success || collection.isCreated) {
        setIsCreated(true);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <>
      {isCreated ? (
        <p>Berhasil Ditambahkan ke koleksi</p>
      ) : (
        <button
          onClick={handleCollection}
          className="bg-rose-500 text-white px-4 py-2 rounded"
        >
          Add To Collection
        </button>
      )}
    </>
  );
};

export default CollectionsButton;
