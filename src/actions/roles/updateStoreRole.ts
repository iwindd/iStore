"use server";

import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { RoleSchema, RoleValues } from "@/schema/Role";

export const updateStoreRole = async (
  storeSlug: string,
  payload: RoleValues & { id: number },
) => {
  const ctx = await getPermissionContext(storeSlug);
  assertStoreCan(ctx, PermissionConfig.store.role.update);

  const validated = RoleSchema.parse(payload);

  const role = await db.storeRole.update({
    where: {
      id: payload.id,
      store_id: ctx.storeId!,
      is_hidden: false,
    },
    data: {
      name: validated.label,
      description: validated.description || null,
      permissions: {
        set: validated.permissions.map((p) => ({ name: p })),
      },
    },
  });

  return role;
};

export default updateStoreRole;
