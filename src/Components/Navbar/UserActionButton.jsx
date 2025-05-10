import Link from "next/link";
import { authUserSession } from "@/libs/auth-libs";

const UserActionButton = async () => {
  const user = await authUserSession();
  const actionlabel = user ? "Sign Out" : "Sign In";
  const actionURL = user ? "/api/auth/signout" : "/api/auth/signin";

  return (
    <div className="flex justify-between gap-2">
      {!user && (
        <Link href="#tentang-kami" className="text-xl">
          About
        </Link>
      )}{" "}
      {/* Hanya tampil saat belum login */}
      {user && <Link href="/users/dashboard">Dashboard</Link>}
      <Link href={actionURL} className="bg-black text-rose-500 py-1 px-12">
        {actionlabel}
      </Link>
    </div>
  );
};

export default UserActionButton;
