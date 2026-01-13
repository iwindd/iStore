"use server";
import { StockPermissionEnum } from "@/enums/permission";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { StockReceipt, StockReceiptStatus } from "@prisma/client";

const CancelStock = async (
  id: number
): Promise<ActionResponse<StockReceipt>> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    const data = await db.stockReceipt.update({
      where: {
        id: id,
        store_id: user.store,
        creator_id: user.limitPermission(StockPermissionEnum.DELETE),
      },
      data: {
        status: StockReceiptStatus.CANCEL,
        action_at: new Date(),
      },
    });

    return { success: true, data: data };
  } catch (error) {
    return ActionError(error) as ActionResponse<StockReceipt>;
  }
};

export default CancelStock;
