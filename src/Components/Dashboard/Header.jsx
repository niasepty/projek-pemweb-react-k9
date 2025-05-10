"use client";

import { ArrowSquareLeft } from "@phosphor-icons/react";
import { useRouter } from "next/navigation"; // ✅ perbaikan di sini

const Header = ({ title }) => {
  const router = useRouter(); // ✅ perbaikan di sini

  const handleBack = (event) => {
    event.preventDefault();
    router.back();
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <button onClick={handleBack} className="flex items-center gap-2">
        <ArrowSquareLeft size={32} />
        <span>BACK</span>
      </button>
      <h3 className="text-2xl font-bold">{title}</h3>
    </div>
  );
};

export default Header;
