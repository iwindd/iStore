"use server";
import { OverStockPermissionEnum } from "@/enums/permission";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import {  getUser } from "@/libs/session";

const PatchOverstock = async (id: number): Promise<ActionResponse<boolean>> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    if (!user.hasPermission(OverStockPermissionEnum.UPDATE)) throw new Error("Forbidden");
    await db.orderProduct.update({
      where: {
        id: id,
        order: {
          store_id: user.store,
        },
      },
      data: {
        overstock_at: new Date(),
      },
    });

    return { success: true, data: true };
  } catch (error) {
    return ActionError(error) as ActionResponse<boolean>;
  }
};

export default PatchOverstock;
