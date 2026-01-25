"use server";

import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { EmployeeSchema, EmployeeValues } from "@/schema/Employee";
import bcrypt from "bcrypt";

export const updateStoreEmployee = async (
  storeSlug: string,
  payload: EmployeeValues & { id: number },
) => {
  const ctx = await getPermissionContext(storeSlug);
  assertStoreCan(ctx, PermissionConfig.store.employee.update);

  const validated = EmployeeSchema.parse(payload);

  // Prepare user update data
  const userUpdateData: any = {
    first_name: validated.firstName,
    last_name: validated.lastName,
    email: validated.email,
  };

  // Only update password if provided
  if (validated.password && validated.password.length > 0) {
    userUpdateData.password = await bcrypt.hash(validated.password, 10);
  }

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
      user: {
        update: userUpdateData,
      },
    },
  });

  return employee;
};

export default updateStoreEmployee;
