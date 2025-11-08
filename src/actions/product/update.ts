"use server";
import { ProductPermissionEnum } from "@/enums/permission";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { ProductSchema, ProductValues } from "@/schema/Product";

const UpdateProduct = async (
  payload: ProductValues,
  id: number
): Promise<ActionResponse<ProductValues>> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    const validated = ProductSchema.parse(payload);
    await db.product.update({
      where: {
        id: id,
        store_id: user.store,
        user_store_id: !user.hasPermission(ProductPermissionEnum.UPDATE)
          ? user.userStoreId
          : undefined,
      },
      data: {
        label: validated.label,
        price: validated.price,
        cost: validated.cost,
        stock_min: validated.stock_min,
        category_id: validated.category_id,
        keywords: validated.keywords,
        deleted_at: null,
      },
    });

    return { success: true, data: validated };
  } catch (error) {
    return ActionError(error) as ActionResponse<ProductValues>;
  }
};

export default UpdateProduct;
