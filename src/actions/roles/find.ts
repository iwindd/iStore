"use server";
import { RolePermissionEnum } from "@/enums/permission";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";

interface RoleFindResult {
  id: number;
  label: string;
  permissions: string[];
}

export const find = async (
  roleId: number
): Promise<ActionResponse<RoleFindResult | null>> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    if (!user.hasPermission(RolePermissionEnum.READ))
      throw new Error("Forbidden");
    const role = await db.role.findUnique({
      where: {
        id: roleId,
        store_id: user.store,
      },
      select: {
        id: true,
        label: true,
        permissions: true,
      },
    });

    return {
      success: true,
      data:
        (role && {
          ...role,
          permissions: role.permissions.map((p) => p.name),
        }) ||
        null,
    };
  } catch (error) {
    return ActionError(error) as ActionResponse<RoleFindResult>;
  }
};
