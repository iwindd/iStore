"use server";
import { BorrowPermissionEnum } from "@/enums/permission";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { Borrows } from "@prisma/client";

const PatchBorrow = async (
  borrowId: number,
  status: Borrows['status']
): Promise<ActionResponse<boolean>> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    if (!user.hasPermission(BorrowPermissionEnum.UPDATE)) throw new Error("Forbidden");
    const data = await db.borrows.update({
      where: {
        id: borrowId,
        store_id: user.store
      },
      data: { 
        status: status
      },
    });

    await db.product.update({
      where: {
        id: data.product_id,
      },
      data: {
        stock: {
          increment: data.amount - data.count
        }
      }
    })

    return { success: true, data: true };
  } catch (error) {
    return ActionError(error) as ActionResponse<boolean>;
  }
};

export default PatchBorrow;
