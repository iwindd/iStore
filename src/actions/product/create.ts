"use server";
import { ProductPermissionEnum } from "@/enums/permission";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { removeWhiteSpace } from "@/libs/formatter";
import { getUser } from "@/libs/session";
import { ProductSchema, ProductValues } from "@/schema/Product";

const CreateProduct = async (
  payload: ProductValues
): Promise<ActionResponse<ProductValues>> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    if (!user.hasPermission(ProductPermissionEnum.CREATE))
      throw new Error("Forbidden");
    const validated = ProductSchema.parse(payload);

    await db.product.create({
      data: {
        serial: removeWhiteSpace(validated.serial),
        label: validated.label,
        price: validated.price,
        cost: validated.cost,
        stock: 0,
        stock_min: validated.stock_min,
        sold: 0,
        store_id: user.store,
        category_id: validated.category_id,
        creator_id: user.userStoreId,
        keywords: validated.keywords,
      },
    });

    return { success: true, data: validated };
  } catch (error) {
    return ActionError(error) as ActionResponse<ProductValues>;
  }
};

export default CreateProduct;
