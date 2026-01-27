"use server";

import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import {
  EmployeeUpdateRoleSchema,
  EmployeeUpdateRoleValues,
} from "@/schema/Employee";

export const updateStoreEmployee = async (
  storeSlug: string,
  payload: EmployeeUpdateRoleValues & { id: number },
) => {
  const ctx = await getPermissionContext(storeSlug);
  assertStoreCan(ctx, PermissionConfig.store.employee.update);

  const validated = EmployeeUpdateRoleSchema.parse(payload);

  const employee = await db.employee.update({
    where: {
      id: payload.id,
      store_id: ctx.storeId!,
    },
    data: {
      role: {
        connect: {
          id: validated.roleId,
        },
      },
    },
  });

  return employee;
};

export default updateStoreEmployee;
