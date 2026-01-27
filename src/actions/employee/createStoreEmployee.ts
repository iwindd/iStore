"use server";

import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { EmployeeSchema, EmployeeValues } from "@/schema/Employee";

export const createStoreEmployee = async (
  storeSlug: string,
  payload: EmployeeValues,
) => {
  const ctx = await getPermissionContext(storeSlug);
  assertStoreCan(ctx, PermissionConfig.store.employee.create);

  const validated = EmployeeSchema.parse(payload);

  const employee = await db.employee.create({
    data: {
      creator: {
        connect: {
          id: ctx.userId,
        },
      },
      user: {
        connect: {
          id: validated.userId,
        },
      },
      role: {
        connect: {
          id: validated.roleId,
        },
      },
      store: {
        connect: {
          id: ctx.storeId!,
        },
      },
    },
  });

  return employee;
};

export default createStoreEmployee;
