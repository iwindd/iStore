"use server";
import { ProductPermissionEnum } from "@/enums/permission";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { ProductUpdateSchema, ProductUpdateValues } from "@/schema/Product";

const UpdateProduct = async (
  payload: ProductUpdateValues,
  id: number
): Promise<ActionResponse<ProductUpdateValues>> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    if (!user.hasPermission(ProductPermissionEnum.UPDATE))
      throw new Error("Unauthorized");
    const validated = ProductUpdateSchema.parse(payload);

    await db.product.update({
      where: {
        id: id,
        store_id: user.store,
      },
      data: {
        label: validated.label,
        price: validated.price,
        cost: validated.cost,
        category_id: validated.category_id,
        /* keywords: validated.keywords, */ // TODO:: Refactor this one
      },
    });

    return { success: true, data: validated };
  } catch (error) {
    return ActionError(error) as ActionResponse<ProductUpdateValues>;
  }
};

export default UpdateProduct;
