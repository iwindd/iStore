"use server";

import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { EmployeeSchema, EmployeeValues } from "@/schema/Employee";
import bcrypt from "bcrypt";

export const createStoreEmployee = async (
  storeSlug: string,
  payload: EmployeeValues,
) => {
  const ctx = await getPermissionContext(storeSlug);
  assertStoreCan(ctx, PermissionConfig.store.employee.create);

  const validated = EmployeeSchema.parse(payload);

  // Generate password if not provided
  const password = validated.password || "password";
  const hashedPassword = await bcrypt.hash(password, 10);

  const employee = await db.employee.create({
    data: {
      creator: {
        connect: {
          id: ctx.userId,
        },
      },
      user: {
        create: {
          first_name: validated.firstName,
          last_name: validated.lastName,
          email: validated.email,
          password: hashedPassword,
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
