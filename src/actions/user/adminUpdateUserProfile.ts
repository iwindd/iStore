"use server";

import db from "@/libs/db";
import { ProfileSchema, ProfileValues } from "@/schema/Profile";

export const adminUpdateUserProfile = async (
  userId: number,
  payload: ProfileValues,
) => {
  //const ctx = await getPermissionContext(storeSlug);
  // Ensure the current user has permission to manage employees
  //assertStoreCan(ctx, PermissionConfig.store.employee.update);
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
