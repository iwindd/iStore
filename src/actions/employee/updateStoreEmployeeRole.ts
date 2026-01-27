"use server";

import db from "@/libs/db";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const UpdateEmployeeRoleSchema = z.object({
  id: z.number(),
  roleId: z.number().min(1),
});

export const updateStoreEmployeeRole = async (
  storeSlug: string,
  payload: { id: number; roleId: number },
) => {
  const ctx = await getPermissionContext(storeSlug);
  //assertStoreCan(ctx, PermissionConfig.store.employee.update);

  const validated = UpdateEmployeeRoleSchema.parse(payload);

  const employee = await db.employee.update({
    where: {
      id: validated.id,
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

  revalidatePath(`/projects/${storeSlug}/employees`);
  revalidatePath(`/projects/${storeSlug}/employees/${validated.id}`);

  return employee;
};

export default updateStoreEmployeeRole;
