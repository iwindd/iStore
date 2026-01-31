"use server";

import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { notFound } from "next/navigation";

export const getStoreRole = async (storeSlug: string, roleId: number) => {
  const ctx = await getPermissionContext(storeSlug);
  assertStoreCan(ctx, PermissionConfig.store.role.get);

  const role = await db.storeRole.findUnique({
    where: {
      id: roleId,
      store_id: ctx.storeId!,
      is_hidden: false,
    },
    include: {
      permissions: true,
      creator: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!role) {
    notFound();
  }

  return role;
};

export default getStoreRole;
