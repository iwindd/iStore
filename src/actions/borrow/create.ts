"use server";
import { BorrowPermissionEnum } from "@/enums/permission";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { BorrowsSchema, BorrowsValues } from "@/schema/Borrows";

const CreateBorrow = async (
  payload: BorrowsValues
): Promise<ActionResponse<BorrowsValues>> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    if (!user.hasPermission(BorrowPermissionEnum.CREATE)) throw new Error("Forbidden")
    BorrowsSchema.parse(payload);
    const product = await db.product.findFirst({
      where: {
        id: payload.product.id,
        store_id: user.store,
        deleted: null
      },
    });
    const validated = BorrowsSchema.parse(payload); // revalidate
    if (!product) throw Error("not_found_product");

    await db.borrows.create({
      data: {
        amount: payload.count,
        note: payload.note,
        status: "PROGRESS",
        product_id: payload.product.id,
        store_id: user.store,
        user_store_id: user.userStoreId,
      },
    });

    await db.product.update({
      where: {
        id: payload.product.id,
        deleted: null
      },
      data: {
        stock: {
          decrement: payload.count,
        },
      },
    });

    return { success: true, data: validated };
  } catch (error) {
    return ActionError(error) as ActionResponse<BorrowsValues>;
  }
};

export default CreateBorrow;
