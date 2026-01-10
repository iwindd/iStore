"use server";
import { ProductPermissionEnum } from "@/enums/permission";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { removeWhiteSpace } from "@/libs/formatter";
import { getUser } from "@/libs/session";
import { ProductSchema, ProductValues } from "@/schema/Product";
import { Product } from "@prisma/client";

const CreateProduct = async (
  payload: ProductValues
): Promise<ActionResponse<Product>> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    if (!user.hasPermission(ProductPermissionEnum.CREATE))
      throw new Error("Forbidden");
    const validated = ProductSchema.parse(payload);

    const product = await db.product.create({
      data: {
        serial: removeWhiteSpace(validated.serial),
        label: validated.label,
        store_id: user.store,
        creator_id: user.employeeId,
      },
    });

    return { success: true, data: product };
  } catch (error) {
    return ActionError(error) as ActionResponse<Product>;
  }
};

export default CreateProduct;
