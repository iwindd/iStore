"use server";

import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";
import { assertGlobalCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { SetPasswordSchema, SetPasswordValues } from "@/schema/Password";
import bcrypt from "bcrypt";

export const adminUpdatePassword = async (
  userId: number,
  payload: SetPasswordValues,
) => {
  const ctx = await getPermissionContext();
  assertGlobalCan(ctx, PermissionConfig.global.user.updatePassword);
  const validated = SetPasswordSchema.parse(payload);

  const hashedPassword = await bcrypt.hash(validated.password, 10);

  await db.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
  });
};
