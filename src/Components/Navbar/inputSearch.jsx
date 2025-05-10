"use client";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useRef } from "react";

const InputSearch = () => {
  const searchRef = useRef(); //untuk handle
  const router = useRouter();
  const handleSearchInput = (event) => {
    const keyword = searchRef.current.value;
    if (!keyword || keyword.trim() == "") return;
    if (event.key === "Enter" || event.type === "click") {
      event.preventDefault();

      router.push(`/search/${keyword}`);
    }
  };
  return (
    <div className="relative text-black">
      <input
        placeholder="cari anime..."
        className="bg-white p-2 rounded w-full"
        ref={searchRef}
        onKeyDown={handleSearchInput}
      />
      <button className="absolute top-2 end-2 " onClick={handleSearchInput}>
        <MagnifyingGlass size={24} className="cursor-pointer text-black" />
      </button>
    </div>
  );
};
export default InputSearch;
