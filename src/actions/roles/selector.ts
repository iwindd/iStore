"use server";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";

export interface RoleSelector {
  id: number;
  label: string;
}

export const selector = async (
  input: string
): Promise<ActionResponse<RoleSelector[]>> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    const products = await db.role.findMany({
      take: 5,
      where: {
        OR: [{ label: { contains: input } }],
        store_id: user.store,
      },
      select: {
        id: true,
        label: true,
      },
    });

    return {
      success: true,
      data: products,
    };
  } catch (error) {
    return ActionError(error) as ActionResponse<RoleSelector[]>;
  }
};

