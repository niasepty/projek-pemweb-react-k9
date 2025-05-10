"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Tambahkan ini

const CommentInput = ({ anime_mal_id, user_email, username, anime_title }) => {
  const [comment, setComment] = useState("");
  const [isCreated, setIsCreated] = useState(false);
  const router = useRouter(); // ✅ Inisialisasi router

  const handleInput = (event) => {
    setComment(event.target.value);
  };

  const handlePosting = async (event) => {
    event.preventDefault();
    const data = { anime_mal_id, user_email, comment, username, anime_title };

    try {
      const response = await fetch("/api/v1/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const text = await response.text();
      const createComment = text ? JSON.parse(text) : {};
      console.log("Collection result:", createComment);

      if (createComment.success || createComment.isCreated) {
        setIsCreated(true);
        setComment(""); // kosongkan textarea
        router.refresh(); // ✅ ini akan memicu reload data di <CommentBox />
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {isCreated && <p className="text-green-600">Postingan Terkirim</p>}
      <textarea
        value={comment}
        onChange={handleInput}
        className="bg-white w-full h-32 text-black text-xl p-4 md:text-lg p-4 rounded resize-none "
      />
      <button
        onClick={handlePosting}
        type="button"
        className="w-52 py-2 px-3 bg-rose-500 text-white rounded ext-base md:text-lg"
      >
        Posting komentar
      </button>
    </div>
  );
};

export default CommentInput;
