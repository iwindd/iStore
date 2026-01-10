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
    if (!user.hasPermission(BorrowPermissionEnum.CREATE))
      throw new Error("Forbidden");
    BorrowsSchema.parse(payload);
    if (!payload.product) throw new Error("not_found_product");
    const product = await db.product.findFirst({
      where: {
        id: payload.product,
        store_id: user.store,
        deleted_at: null,
      },
    });
    const validated = BorrowsSchema.parse(payload); // revalidate
    if (!product) throw new Error("not_found_product");

    await db.borrow.create({
      data: {
        amount: validated.count,
        note: validated.note,
        status: "PROGRESS",
        product_id: product.id,
        store_id: user.store,
        creator_id: user.employeeId,
      },
    });

    await db.product.update({
      where: {
        id: product.id,
        deleted_at: null,
      },
      data: {
        stock: {
          decrement: validated.count,
        },
      },
    });

    return { success: true, data: validated };
  } catch (error) {
    return ActionError(error) as ActionResponse<BorrowsValues>;
  }
};

export default CreateBorrow;
