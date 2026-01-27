"use server";

import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";

export const searchNonEmployeeUsers = async (
  storeSlug: string,
  query: string,
) => {
  const ctx = await getPermissionContext(storeSlug);
  assertStoreCan(ctx, PermissionConfig.store.employee.getNonEmployeeUsers);

  const users = await db.user.findMany({
    where: {
      AND: [
        {
          OR: [
            { first_name: { contains: query, mode: "insensitive" } },
            { last_name: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
          ],
        },
        {
          employees: {
            none: {
              store_id: ctx.storeId,
            },
          },
        },
      ],
    },
    take: 20,
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
    },
  });

  return users;
};
