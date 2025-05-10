import { authUserSession } from "@/libs/auth-libs";
import Link from "next/link";
import Image from "next/image";

const page = async () => {
  const user = await authUserSession();

  return (
    <div className="flex flex-col items-center text-center py-10 px-4">
      <h3 className="text-3xl font-semibold text-rose-600 mb-2">DASHBOARD</h3>
      <h5 className="text-2xl font-bold mb-4 text-rose-500">
        Welcome, {user.name}
      </h5>

      <div className="rounded-full overflow-hidden shadow-lg border-4 border-rose-300 mb-6">
        <Image
          src={user.image || "/default-profile.png"}
          alt="User Profile"
          width={250}
          height={250}
          className="object-cover"
        />
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/users/dashboard/collection"
          className="bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2 px-6 rounded-lg text-lg transition"
        >
          My Collection
        </Link>
        <Link
          href="/users/dashboard/comment"
          className="bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2 px-6 rounded-lg text-lg transition"
        >
          My Comment
        </Link>
      </div>
    </div>
  );
};

export default page;
