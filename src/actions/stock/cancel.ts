"use server";
import { StockPermissionEnum } from "@/enums/permission";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { Stock } from "@prisma/client";

const CancelStock = async (id: number): Promise<ActionResponse<Stock>> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    const data = await db.stock.update({
      where: {
        id: id,
        store_id: user.store,
        creator_id: user.limitPermission(StockPermissionEnum.DELETE),
      },
      data: {
        state: "CANCEL",
        action_at: new Date(),
      },
    });

    return { success: true, data: data };
  } catch (error) {
    return ActionError(error) as ActionResponse<Stock>;
  }
};

export default CancelStock;
