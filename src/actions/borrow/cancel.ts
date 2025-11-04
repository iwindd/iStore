"use server";
import { BorrowPermissionEnum } from "@/enums/permission";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { Borrow } from "@prisma/client";

const CancelBorrow = async (
  borrowId: number,
  status: Borrow['status']
): Promise<ActionResponse<boolean>> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    const data = await db.borrow.update({
      where: {
        id: borrowId,
        store_id: user.store,
        user_store_id: !user.hasPermission(BorrowPermissionEnum.DELETE) ? user.userStoreId : undefined,
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

export default CancelBorrow;
