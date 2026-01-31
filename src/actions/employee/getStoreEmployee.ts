"use server";

import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { notFound } from "next/navigation";

export const getStoreEmployee = async (
  storeSlug: string,
  employeeId: number,
) => {
  const ctx = await getPermissionContext(storeSlug);
  assertStoreCan(ctx, PermissionConfig.store.employee.get);

  const employee = await db.employee.findUnique({
    where: {
      id: employeeId,
      store_id: ctx.storeId!,
      user: {
        id: {
          not: ctx.userId,
        },
      },
    },
    include: {
      user: true,
      role: {
        include: {
          permissions: true,
        },
      },
    },
  });

  if (!employee) {
    notFound();
  }

  return employee;
};

export default getStoreEmployee;
