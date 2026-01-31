"use server";

import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { Prisma } from "@prisma/client";

const DEFAULT_SELECT: Prisma.StoreRoleSelect = {
  id: true,
  name: true,
};

export type RoleSelectorInstance = Prisma.StoreRoleGetPayload<{
  select: {
    id: true;
    name: true;
  };
}>;

const fetchRoleSelector = async (
  storeSlug: string,
  id: number,
): Promise<RoleSelectorInstance | null> => {
  const ctx = await getPermissionContext(storeSlug);
  assertStoreCan(ctx, PermissionConfig.store.role.getSelector);

  const role = await db.storeRole.findUnique({
    where: {
      id: id,
      store_id: ctx.storeId!,
      is_hidden: false,
    },
    select: DEFAULT_SELECT,
  });

  return role;
};

const searchRoleSelector = async (
  storeSlug: string,
  query: string,
): Promise<RoleSelectorInstance[]> => {
  const ctx = await getPermissionContext(storeSlug);
  assertStoreCan(ctx, PermissionConfig.store.role.getSelector);

  const roles = await db.storeRole.findMany({
    where: {
      store_id: ctx.storeId!,
      name: {
        contains: query,
        mode: "insensitive",
      },
    },
    select: DEFAULT_SELECT,
    take: 15,
  });

  return roles;
};

export { fetchRoleSelector, searchRoleSelector };
