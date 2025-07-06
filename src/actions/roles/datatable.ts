"use server";
import { TableFetch } from "@/components/Datatable";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { order } from "@/libs/formatter";
import { getUser } from "@/libs/session";

export interface Role {
  id: number,
  label: string,
  created_at: Date,
}

export const datatable = async (
  table: TableFetch
): Promise<ActionResponse<Role[]>> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    const roles = await db.$transaction([
      db.role.findMany({
        skip: table.pagination.page * table.pagination.pageSize,
        take: table.pagination.pageSize,
        orderBy: order(table.sort),
        where: {
          store_id: user.store,
        },
        select: {
          id: true,
          created_at: true,
          label: true,
          permission: true, 
        }
      }),
      db.role.count({
        where: {
          store_id: user.store,
        },
      }),
    ]);

    return {
      success: true,
      data: roles[0],
      total: roles[1],
    };
  } catch (error) {
    return ActionError(error) as ActionResponse<Role[]>;
  }
};
