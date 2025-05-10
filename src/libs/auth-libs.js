import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const authUserSession = async () => {
  const sesion = await getServerSession(authOptions);
  return sesion?.user;
};
