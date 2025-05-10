import Link from "next/link";
import InputSearch from "./inputSearch";
import UserActionButton from "./UserActionButton";

const Navbar = () => {
  return (
    <header className="bg-rose-500">
      <div className="flex md:flex-row flex-col justify-between md:items-center p-4 gap-2">
        <Link href="/" className="font-bold text-white text-2xl">
          ANIMEKU
        </Link>
        <InputSearch />
        <UserActionButton />
      </div>
    </header>
  );
};
export default Navbar;
