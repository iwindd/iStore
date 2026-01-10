"use server";
import { TableFetch } from "@/components/Datatable";
import { BorrowPermissionEnum } from "@/enums/permission";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { order } from "@/libs/formatter";
import { getUser } from "@/libs/session";
import { Borrow } from "@prisma/client";

const GetBorrows = async (
  table: TableFetch
): Promise<ActionResponse<Borrow[]>> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    const borrows = await db.$transaction([
      db.borrow.findMany({
        skip: table.pagination.page * table.pagination.pageSize,
        take: table.pagination.pageSize,
        orderBy: order(table.sort),
        where: {
          store_id: user.store,
          creator_id: !user.hasPermission(BorrowPermissionEnum.READ)
            ? user.employeeId
            : undefined,
        },
        include: {
          product: {
            select: {
              label: true,
            },
          },
          creator: {
            select: {
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      }),
      db.borrow.count({
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
    return ActionError(error) as ActionResponse<Borrow[]>;
  }
};

export default GetBorrows;
