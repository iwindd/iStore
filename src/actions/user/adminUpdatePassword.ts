"use server";

import db from "@/libs/db";
import { SetPasswordSchema, SetPasswordValues } from "@/schema/Password";
import bcrypt from "bcrypt";

export const adminUpdatePassword = async (
  userId: number,
  payload: SetPasswordValues,
) => {
  //const ctx = await getPermissionContext(storeSlug);
  // Ensure the current user has permission to manage employees
  //assertStoreCan(ctx, PermissionConfig.store.employee.update);
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
