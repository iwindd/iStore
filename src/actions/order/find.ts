"use server";
import { CashoutType } from "@/enums/cashout";
import {
  HistoryPermissionEnum,
  OverStockPermissionEnum,
  PurchasePermissionEnum,
} from "@/enums/permission";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { Order, OrderProduct } from "@prisma/client";

interface History extends Order {
  products: OrderProduct[];
  creator: {
    user: {
      name: string;
    };
  };
}

const GetHistory = async (
  id: number
): Promise<ActionResponse<History | null>> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    const history = await db.order.findFirst({
      where: {
        id: id,
        store_id: user.store,
        OR: [
          {
            type: CashoutType.CASHOUT,
            creator_id: user.onPermission(HistoryPermissionEnum.READ),
          },
          {
            type: CashoutType.CASHOUT,
            creator_id: user.onPermission(OverStockPermissionEnum.READ),
            products: {
              some: {
                overstock: {
                  gte: 1,
                },
              },
            },
          },
          {
            type: CashoutType.PURCHASE,
            creator_id: user.onPermission(PurchasePermissionEnum.READ),
          },
        ],
      },
      include: {
        products: true,
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
    });

    return {
      success: true,
      data: history as History | null,
    };
  } catch (error) {
    return ActionError(error) as ActionResponse<History | null>;
  }
};

export default GetHistory;
