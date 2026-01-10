import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import AuthConfig from "./config/AuthConfig";
import { SuperPermissionEnum } from "./enums/permission";
import db from "./libs/db";
import { AddressValues, FormatAddress } from "./schema/Address";

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

      const now = Math.floor(Date.now() / 1000);
      const REVALIDATE_TIMEOUT =
        process.env.NODE_ENV === "production" ? 90 : 10;

      const shouldRevalidate =
        !token.lastChecked || now - token.lastChecked > REVALIDATE_TIMEOUT;

      if (shouldRevalidate && token.id) {
        try {
          const updatedUser = await db.user.findUnique({
            where: { id: Number(token.id) },
            select: {
              name: true,
              email: true,
              employees: {
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

          if (updatedUser?.employees?.[0]) {
            const employee = updatedUser.employees[0];
            const role = employee.role;

            token.name = updatedUser.name;
            token.email = updatedUser.email;
            token.store = employee.store.id;
            token.employeeId = employee.id;
            token.line_token = employee.store.line_token;
            token.permissions = role.is_super_admin
              ? [SuperPermissionEnum.ALL]
              : role.permissions.flatMap((p) => p.name);
            token.address = FormatAddress(employee.store as AddressValues);
            token.lastChecked = now;
          }
        } catch (error) {
          console.error("Error revalidating session:", error);
        }
      }

      return {
        id: token.id,
        store: token.store,
        employeeId: token.employeeId,
        name: token.name,
        email: token.email,
        line_token: token.line_token,
        permissions: token.permissions,
        address: token.address,
        lastChecked: token.lastChecked || now,
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
          if (!credentials) throw new Error("no_credentials");
          if (!credentials.email || !credentials.password)
            throw new Error("missing_credentials");

          const user = await db.user.findFirst({
            where: {
              email: credentials.email,
            },
            select: {
              id: true,
              email: true,
              password: true,
              name: true,
              employees: {
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
            !(await bcrypt.compare(
              credentials.password as string,
              user.password
            ))
          )
            throw new Error("not_found_user");

          const employee = user?.employees?.[0];

          if (!user || !employee) throw new Error("no_store");

          const role = employee.role;

          return {
            id: String(user.id),
            employeeId: employee.id,
            store: employee.store.id,
            name: user.name,
            email: user.email,
            line_token: employee.store.line_token,
            permissions: role.is_super_admin
              ? [SuperPermissionEnum.ALL]
              : role.permissions.flatMap((p) => p.name),
            address: FormatAddress(employee.store as AddressValues),
          };
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],
});
