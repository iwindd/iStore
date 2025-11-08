"use server";
import { TableFetch } from "@/components/Datatable";
import { StockPermissionEnum } from "@/enums/permission";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { filter, order } from "@/libs/formatter";
import { getUser } from "@/libs/session";
import { Stock as StockOriginal } from "@prisma/client";

interface Stock extends StockOriginal {
  _count: {
    products: number;
  };
}

const GetStocks = async (
  table: TableFetch
): Promise<ActionResponse<Stock[]>> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    const stocks = await db.$transaction([
      db.stock.findMany({
        skip: table.pagination.page * table.pagination.pageSize,
        take: table.pagination.pageSize,
        orderBy: order(
          table.sort.length > 0
            ? table.sort
            : [{ field: "created_at", sort: "desc" }]
        ),
        where: {
          ...filter(table.filter, ["note"]),
          store_id: user.store,
          creator_id: !user.hasPermission(StockPermissionEnum.READ)
            ? user.userStoreId
            : undefined,
        },
        include: {
          _count: {
            select: {
              products: true,
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
      db.order.count({
        where: {
          store_id: user.store,
        },
      }),
    ]);

    return {
      success: true,
      data: stocks[0],
      total: stocks[1],
    };
  } catch (error) {
    return ActionError(error) as ActionResponse<Stock[]>;
  }
};

export default GetStocks;
