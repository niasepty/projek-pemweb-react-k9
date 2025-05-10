"use client";
import { FileSearch } from "@phosphor-icons/react";

import { useRouter } from "next/navigation";

const Notfound = () => {
  const router = useRouter();
  return (
    <div className=" min-h-screen max-w-xl mx-auto flex justify-center items-center">
      <div className="flex justify-center items-center flex-col">
        <FileSearch size={44} className="text-rose-500 gap-4 " />
        <h3 className="text-rose-500 text-4xl font-bold">NOT FOUND</h3>
        <button
          onClick={() => router.back()}
          className="text-white hover:text-rose-500 underline"
        >
          Kembali{" "}
        </button>
      </div>
    </div>
  );
};
export default Notfound;
