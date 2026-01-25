"use server";

import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";

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
    throw new Error("Employee not found");
  }

  return employee;
};

export default getStoreEmployee;
