"use server";
import { PermissionEnum, RolePermissionEnum } from "@/enums/permission";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { permissionsToMask } from "@/libs/permission";
import { getUser } from "@/libs/session";
import { RoleSchema, RoleValues } from "@/schema/Role";

export const update = async (
  payload: RoleValues,
  id: number
): Promise<ActionResponse<RoleValues>> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    if (!user.hasPermission(RolePermissionEnum.UPDATE)) throw new Error("Forbidden");
    const validated = RoleSchema.parse(payload);
    const mask = permissionsToMask(validated.permissions as PermissionEnum[]);

    await db.role.update({
      where: {
        id: id,
        store_id: user.store,
      },
      data: {
        label: validated.label,
        permission: mask.toString(),
      },
    });

    return { success: true, data: validated };
  } catch (error) {
    return ActionError(error) as ActionResponse<RoleValues>;
  }
};
