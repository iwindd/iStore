"use server";
import { TableFetch } from "@/components/Datatable";
import { HistoryPermissionEnum } from "@/enums/permission";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { filter, order } from "@/libs/formatter";
import { getUser } from "@/libs/session";
import { Order } from "@prisma/client";

const GetHistories = async (
  table: TableFetch
): Promise<ActionResponse<Order[]>> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    const histories = await db.$transaction([
      db.order.findMany({
        skip: table.pagination.page * table.pagination.pageSize,
        take: table.pagination.pageSize,
        orderBy: order(
          table.sort.length > 0
            ? table.sort
            : [{ field: "created_at", sort: "desc" }]
        ),
        where: {
          ...filter(table.filter, ["text", "note"]),
          store_id: user.store,
          creator_id: user.limitPermission(HistoryPermissionEnum.READ),
        },
        include: {
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
      db.order.count({
        where: {
          store_id: user.store,
          creator_id: user.limitPermission(HistoryPermissionEnum.READ),
        },
      }),
    ]);

    return {
      success: true,
      data: histories[0],
      total: histories[1],
    };
  } catch (error) {
    return ActionError(error) as ActionResponse<Order[]>;
  }
};

export default GetHistories;
