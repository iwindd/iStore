"use server";

import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";
import { assertGlobalCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { ProfileSchema, ProfileValues } from "@/schema/Profile";

export const adminUpdateUserProfile = async (
  userId: number,
  payload: ProfileValues,
) => {
  const ctx = await getPermissionContext();
  assertGlobalCan(ctx, PermissionConfig.global.user.updateUser);
  const validated = ProfileSchema.parse(payload);

  await db.user.update({
    where: {
      id: userId,
    },
    data: {
      first_name: validated.first_name,
      last_name: validated.last_name,
    },
  });

  return {
    first_name: validated.first_name,
    last_name: validated.last_name,
  };
};
