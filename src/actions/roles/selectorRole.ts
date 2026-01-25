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
  storeId: string,
  id: number,
): Promise<RoleSelectorInstance | null> => {
  const ctx = await getPermissionContext(storeId);

  const role = await db.storeRole.findUnique({
    where: {
      id: id,
      store_id: ctx.storeId!,
    },
    select: DEFAULT_SELECT,
  });

  return role;
};

const searchRoleSelector = async (
  storeId: string,
  query: string,
): Promise<RoleSelectorInstance[]> => {
  const ctx = await getPermissionContext(storeId);

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

const createRoleSelector = async (
  storeId: string,
  name: string,
): Promise<RoleSelectorInstance | null> => {
  try {
    const ctx = await getPermissionContext(storeId);
    assertStoreCan(ctx, PermissionConfig.store.role.create);

    const role = await db.storeRole.create({
      data: {
        name: name,
        store_id: ctx.storeId!,
        creator_id: ctx.employeeId!,
      },
      select: DEFAULT_SELECT,
    });

    return role;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export { createRoleSelector, fetchRoleSelector, searchRoleSelector };
