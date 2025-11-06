"use server";
import { RolePermissionEnum, SuperPermissionEnum } from "@/enums/permission";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { RoleSchema, RoleValues } from "@/schema/Role";

export const update = async (
  payload: RoleValues,
  id: number
): Promise<ActionResponse<RoleValues>> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    if (!user.hasPermission(RolePermissionEnum.UPDATE))
      throw new Error("Forbidden");

    const validated = RoleSchema.parse(payload);

    const isSuperAdminRole =
      (await db.role.count({
        where: {
          id: id,
          store_id: user.store,
          is_super_admin: true,
        },
      })) > 0;

    const permissionToSet = isSuperAdminRole
      ? [SuperPermissionEnum.ALL]
      : validated.permissions;

    await db.role.update({
      where: {
        id: id,
        store_id: user.store,
      },
      data: {
        label: validated.label,
        permissions: {
          set: permissionToSet.map((p) => ({ name: p })),
        },
      },
    });

    return { success: true, data: validated };
  } catch (error) {
    return ActionError(error) as ActionResponse<RoleValues>;
  }
};
