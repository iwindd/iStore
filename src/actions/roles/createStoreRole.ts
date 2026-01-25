"use server";

import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { RoleSchema, RoleValues } from "@/schema/Role";

export const createStoreRole = async (
  storeSlug: string,
  payload: RoleValues,
) => {
  const ctx = await getPermissionContext(storeSlug);
  assertStoreCan(ctx, PermissionConfig.store.role.create);
  const validated = RoleSchema.parse(payload);

  const role = await db.storeRole.create({
    data: {
      name: validated.label,
      description: validated.description || null,
      permissions: {
        connect: validated.permissions.map((p) => ({ name: p })),
      },
      store_id: ctx.storeId!,
      creator_id: ctx.employeeId!,
    },
  });

  return role;
};

export default createStoreRole;
