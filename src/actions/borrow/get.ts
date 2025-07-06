"use server";
import { TableFetch } from "@/components/Datatable";
import { BorrowPermissionEnum } from "@/enums/permission";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { order } from "@/libs/formatter";
import { getUser } from "@/libs/session";
import { Borrows } from "@prisma/client";

const GetBorrows = async (
  table: TableFetch
): Promise<ActionResponse<Borrows[]>> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    if (!user.hasPermission(BorrowPermissionEnum.READ)) throw new Error("Forbidden");
    const borrows = await db.$transaction([
      db.borrows.findMany({
        skip: table.pagination.page * table.pagination.pageSize,
        take: table.pagination.pageSize,
        orderBy: order(table.sort),
        where: {
          store_id: user.store,
        },
        include: {
          product: {
            select: {
              label: true
            }
          },
          user_store: {
            select: {
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
        }
      }),
      db.borrows.count({
        where: {
          store_id: user.store,
        },
      }),
    ]);

    return {
      success: true,
      data: borrows[0],
      total: borrows[1],
    };
  } catch (error) {
    return ActionError(error) as ActionResponse<Borrows[]>;
  }
};

export default GetBorrows;
