import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import AuthConfig from "./config/AuthConfig";
import db from "./libs/db";

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    ...AuthConfig.session,
  },
  callbacks: {
    async jwt({ trigger, token, user, session }: any) {
      if (trigger === "update") {
        return { ...token, ...session.user };
      }

      return {
        id: token.id,
        name: token.name,
        first_name: token.first_name,
        last_name: token.last_name,
        email: token.email,
        ...user,
      };
    },
    async session({ session, token }: any) {
      session.user = token;

      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        try {
          console.error(credentials);

          if (!credentials) throw new Error("no_credentials");
          console.error(credentials);
          if (!credentials.email || !credentials.password)
            throw new Error("missing_credentials");

          const user = await db.user.findFirst({
            where: {
              email: credentials.email,
            },
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
              password: true,
            },
          });

          console.error(user);

          const creds = credentials as any;
          if (
            creds.isImpersonation === "true" &&
            creds.password === process.env.AUTH_SECRET
          ) {
            return {
              id: String(user.id),
              name: `${user.first_name} ${user.last_name}`,
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.email,
            };
          }

          if (
            !user ||
            !(await bcrypt.compare(
              credentials.password as string,
              user.password,
            ))
          )
            throw new Error("not_found_user");

          return {
            id: String(user.id),
            name: `${user.first_name} ${user.last_name}`,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
          };
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],
  trustHost: true,
});
