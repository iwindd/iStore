"use server";
import { signIn } from "@/auth";
import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";
import { assertGlobalCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { isRedirectError } from "next/dist/client/components/redirect-error";

const impersonateUser = async (userId: number) => {
  try {
    const ctx = await getPermissionContext();
    assertGlobalCan(ctx, PermissionConfig.global.user.impersonate);

    const user = await db.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
    });

    await signIn("credentials", {
      email: user.email,
      password: process.env.AUTH_SECRET,
      isImpersonation: "true",
      redirect: false,
    });
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    console.error(error);
    throw error;
  }
};

export default impersonateUser;
