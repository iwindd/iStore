import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import AuthConfig from "./config/AuthConfig";
import { SuperPermissionEnum } from "./enums/permission";
import db from "./libs/db";
import { AddressValues, FormatAddress } from "./schema/Address";

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/",
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
        store: token.store,
        userStoreId: token.userStoreId,
        name: token.name,
        email: token.email,
        line_token: token.line_token,
        permissions: token.permissions,
        address: token.address,
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
                  id: true,
                  store: true,
                  role: {
                    select: {
                      permissions: true,
                      is_super_admin: true,
                    },
                  },
                },
              },
            },
          });

          if (
            !user ||
            !(await bcrypt.compare(credentials.password, user.password))
          )
            throw new Error("not_found_user");

          const userStore = user?.userStores?.[0];

          if (!user || !userStore) throw new Error("no_store");

          const role = userStore.role;

          return {
            id: String(user.id),
            userStoreId: userStore.id,
            store: userStore.store.id,
            name: user.name,
            email: user.email,
            line_token: userStore.store.line_token,
            permissions: role.is_super_admin
              ? [SuperPermissionEnum.ALL]
              : role.permissions.flatMap((p) => p.name),
            address: FormatAddress(userStore.store as AddressValues),
          };
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],
});
