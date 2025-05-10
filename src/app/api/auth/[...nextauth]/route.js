import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import {} from "@/app/api/auth/[...nextauth]/route";

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
