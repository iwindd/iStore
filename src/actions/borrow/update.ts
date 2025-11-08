"use server";
import { CashoutMethod, CashoutType } from "@/enums/cashout";
import { BorrowPermissionEnum } from "@/enums/permission";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";

const UpdateBorrow = async (
  borrowId: number,
  count: number
): Promise<ActionResponse<boolean>> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    const data = await db.borrow.update({
      where: {
        id: borrowId,
        store_id: user.store,
        creator_id: user.onPermission(BorrowPermissionEnum.UPDATE),
        status: "PROGRESS",
      },
      data: {
        count: {
          increment: count,
        },
        status: "SUCCESS",
      },
    });
    if (!data) throw new Error("Forbidden");

    if (data && data.count < data.amount) {
      const product = await db.product.update({
        where: {
          id: data.product_id,
        },
        data: {
          stock: {
            increment: data.amount - data.count,
          },
        },
        include: {
          category: {
            select: {
              label: true,
            },
          },
        },
      });

      if (data.count > 0 && user.store) {
        const totalPrice = product.price * data.count;
        const totalCost = product.cost * data.count;
        await db.order.create({
          data: {
            price: totalPrice,
            cost: totalCost,
            profit: totalPrice - totalCost,
            note: data.note,
            text: product.label,
            store_id: user.store,
            method: CashoutMethod.CASH,
            type: CashoutType.BORROW,
            products: {
              create: [
                {
                  serial: product.serial,
                  label: product.label,
                  category: product.category?.label || "ไม่มีประเภท",
                  price: product.price,
                  cost: product.cost,
                  count: data.count,
                  overstock: 0,
                },
              ],
            },
          },
        });
      }
    }

    return { success: true, data: true };
  } catch (error) {
    return ActionError(error) as ActionResponse<boolean>;
  }
};

export default UpdateBorrow;
