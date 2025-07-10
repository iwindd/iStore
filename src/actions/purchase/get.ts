"use server";
import { TableFetch } from "@/components/Datatable";
import { CashoutType } from "@/enums/cashout";
import { PurchasePermissionEnum } from "@/enums/permission";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { order } from "@/libs/formatter";
import { getUser } from "@/libs/session";

export interface Purchase {
  id: number,
  created_at: Date,
  cost: number,
  text: string,
  note: string,
  products: {
    count: number
  }[]
}

const GetPurchase = async (
  table: TableFetch
): Promise<ActionResponse<Purchase[]>> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    if (!user.hasPermission(PurchasePermissionEnum.READ)) throw new Error("Forbidden");
    const purchase = await db.$transaction([
      db.order.findMany({
        skip: table.pagination.page * table.pagination.pageSize,
        take: table.pagination.pageSize,
        orderBy: order(table.sort),
        where: {
          store_id: user.store,
          type: CashoutType.PURCHASE
        },
        select: {
          id: true,
          created_at: true,
          cost: true,
          text: true,
          note: true,
          products: {
            select: {
              count: true
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
      db.order.count({
        where: {
          store_id: user.store,
          type: CashoutType.PURCHASE
        },
      }),
    ]);

    return {
      success: true,
      data: purchase[0],
      total: purchase[1],
    };
  } catch (error) {
    return ActionError(error) as ActionResponse<Purchase[]>;
  }
};

export default GetPurchase;
