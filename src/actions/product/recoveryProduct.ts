"use server";
import { ProductPermissionEnum } from "@/enums/permission";
import { ActionError } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";

const recoveryProduct = async (id: number) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    if (!user.hasPermission(ProductPermissionEnum.CREATE))
      throw new Error("Unauthorized");

    await db.product.update({
      where: {
        id: id,
        store_id: user.store,
      },
      data: {
        deleted_at: null,
      },
    });

    return { success: true, data: true };
  } catch (error) {
    return ActionError(error);
  }
};

export default recoveryProduct;
