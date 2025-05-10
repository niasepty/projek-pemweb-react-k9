"use client";

import { useState } from "react";
import YouTube from "react-youtube";

const VideoPlayer = ({ youtubeid }) => {
  const [isOpen, setIsOpen] = useState(true);

  const togglePlayer = () => {
    setIsOpen((prev) => !prev);
  };

  const options = {
    width: "300",
    height: "250",
  };

  const Player = () => (
    <div className="fixed bottom-4 right-4 p-4 bg-white rounded-lg shadow-2xl z-50 transition-all">
      <button
        onClick={togglePlayer}
        className="absolute top-2 right-2 bg-gray-600 text-white text-sm px-2 py-1 rounded hover:bg-gray-800 transition cursor-pointer"
      >
        ✕
      </button>
      <YouTube
        videoId={youtubeid}
        opts={options}
        onReady={(e) => e.target.pauseVideo()}
        onError={() => alert("Video bermasalah, silakan coba yang lain.")}
      />
    </div>
  );

  const OpenButton = () => (
    <button
      onClick={togglePlayer}
      className="fixed bottom-5 right-5 w-36 h-12 bg-white text-black font-semibold text-base rounded-lg shadow-xl hover:bg-rose-500 hover:text-white transition-all"
    >
      Tonton Trailer
    </button>
  );

  return isOpen ? <Player /> : <OpenButton />;
};

export default VideoPlayer;
