"use server";
import { ProductPermissionEnum } from "@/enums/permission";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { Product } from "@prisma/client";

const DeleteProduct = async (id: number): Promise<ActionResponse<Product>> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    if (!user.hasPermission(ProductPermissionEnum.DELETE)) throw new Error("Forbidden");
    const data = await db.product.delete({
      where: {
        id: id,
        store_id: user.store,
      },
    });

    return { success: true, data: data };
  } catch (error) {
    return ActionError(error) as ActionResponse<Product>;
  }
};

export default DeleteProduct;
