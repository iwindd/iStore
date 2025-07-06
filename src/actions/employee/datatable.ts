"use server";
import { TableFetch } from "@/components/Datatable";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { order } from "@/libs/formatter";
import { getUser } from "@/libs/session";

export interface User {
  id: number,
  name: string,
  email: string,
}

export const datatable = async (
  table: TableFetch
): Promise<ActionResponse<User[]>> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    const employees = await db.$transaction([
      db.user.findMany({
        skip: table.pagination.page * table.pagination.pageSize,
        take: table.pagination.pageSize,
        orderBy: order(table.sort),
        where: {
          userStores: {
            some: {
              storeId: user.store,
            }
          }
        },
        select: {
          id: true,
          name: true,
          email: true,
          userStores: {
            select: {
              role:{
                select: {
                  id: true,
                  label: true,
                }
              }
            }
          }
        }
      }),
      db.user.count({
        where: {
          userStores: {
            some: {
              storeId: user.store,
            }
          }
        },
      }),
    ]);

    return {
      success: true,
      data: employees[0],
      total: employees[1],
    };
  } catch (error) {
    return ActionError(error) as ActionResponse<User[]>;
  }
};
