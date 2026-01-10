"use server";
import { EmployeePermissionEnum } from "@/enums/permission";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { EmployeeSchema, EmployeeValues } from "@/schema/Employee";

export const update = async (
  payload: EmployeeValues,
  id: number
): Promise<ActionResponse<EmployeeValues>> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    if (!user.hasPermission(EmployeePermissionEnum.UPDATE))
      throw new Error("Forbidden");
    const validated = EmployeeSchema.parse(payload);
    if (!validated.role) throw new Error("Role is required");

    await db.user.update({
      where: { id: id },
      data: {
        name: validated.name,
        employees: {
          update: {
            where: {
              user_id_store_id: {
                user_id: id,
                store_id: user.store.toString(),
              },
            },
            data: {
              role: {
                connect: { id: validated.role },
              },
            },
          },
        },
      },
    });

    return { success: true, data: validated };
  } catch (error) {
    return ActionError(error) as ActionResponse<EmployeeValues>;
  }
};
