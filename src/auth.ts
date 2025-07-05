import CredentialsProvider from "next-auth/providers/credentials";
import AuthConfig from "./config/AuthConfig";
import db from "./libs/db";
import bcrypt from "bcrypt";
import { StoreAddress } from "../next-auth";
import { AddressValues, FormatAddress } from "./schema/Address";

export const authOptions = {
  pages: {
    signIn: "/",
  },
  session: {
    jwt: true,
    ...AuthConfig.session,
  },
  callbacks: {
    async jwt({ trigger, token, user, session }: any) {
      if (trigger === "update") {
        return { ...token, ...session.user };
      }

      return {
        ...{
          id: token.id,
          store: token.store,
          name: token.name,
          email: token.email,
          line_token: token.line_token,
          address: token.address
        },
        ...user,
      };
    },
    async session({ session, token }: any) {
      session.user = token as any;

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
          if (!credentials) throw new Error("no_credentails");
          const user = await db.user.findFirst({
            where: {
              email: credentials.email,
            },
            select: {
              id: true,
              email: true,
              password: true,
              name: true,
              userStores: {
                take: 1,
                select: {
                  store: true,
                },
              },
            },
          });

          if (
            !user ||
            !(await bcrypt.compare(credentials.password, user.password))
          )
            throw new Error("not_found_user");

          const store = user?.userStores?.[0]?.store;

          if (!user || !store) throw new Error("no_store");

          return {
            id: String(user.id),
            store: store.id,
            name: user.name,
            email: user.email,
            line_token: store.line_token,
            address: FormatAddress(store as AddressValues),
          };
        } catch (error) {
          return null;
        }
      },
    }),
  ],
};
