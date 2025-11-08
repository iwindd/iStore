"use server";
import { RolePermissionEnum } from "@/enums/permission";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { RoleSchema, RoleValues } from "@/schema/Role";

export const create = async (
  payload: RoleValues
): Promise<ActionResponse<RoleValues>> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    if (!user.hasPermission(RolePermissionEnum.CREATE))
      throw new Error("Forbidden");
    const validated = RoleSchema.parse(payload);

    await db.role.create({
      data: {
        label: validated.label,
        permissions: {
          connect: validated.permissions.map((p) => ({ name: p })),
        },
        store_id: user.store,
        creator_id: user.userStoreId,
      },
    });

    return { success: true, data: validated };
  } catch (error) {
    return ActionError(error) as ActionResponse<RoleValues>;
  }
};
