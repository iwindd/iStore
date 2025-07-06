"use server";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";

interface RoleFindResult {
  id: number;
  label: string;
  permission: string;
}

export const find = async (
  roleId: number
): Promise<ActionResponse<RoleFindResult | null>> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    const role = await db.role.findUnique({
      where: {
        id: roleId,
        store_id: user.store,
      },
      select: {
        id: true,
        label: true,
        permission: true,
      },
    });


    return {
      success: true,
      data: role || null,
    };
  } catch (error) {
    return ActionError(error) as ActionResponse<RoleFindResult>;
  }
};
