"use server";
import { HistoryPermissionEnum } from "@/enums/permission";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { Order, OrderProduct } from "@prisma/client";

interface History extends Order{
  products: OrderProduct[]
}

const GetHistory = async (
  id: number
): Promise<ActionResponse<History | null>> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    if (!user.hasPermission(HistoryPermissionEnum.READ)) throw new Error("Forbidden");
    const history = await db.order.findFirst({
      where: {
        id: id,
        store_id: user.store,
      },
      include: {
        products: true
      }
    });

    return {
      success: true,
      data: history,
    };
  } catch (error) {
    return ActionError(error) as ActionResponse<History | null>;
  }
};

export default GetHistory;
