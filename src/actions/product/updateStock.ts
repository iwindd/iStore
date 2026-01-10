"use server";
import { ProductPermissionEnum } from "@/enums/permission";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import {
  ProductUpdateStockSchema,
  ProductUpdateStockValues,
} from "@/schema/Product";
import { StockState } from "@prisma/client";

const UpdateStock = async (
  payload: ProductUpdateStockValues,
  id: number
): Promise<ActionResponse<ProductUpdateStockValues>> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    if (!user.hasPermission(ProductPermissionEnum.UPDATE))
      throw new Error("Unauthorized");
    const validated = ProductUpdateStockSchema.parse(payload);

    await db.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: {
          id: id,
          store_id: user.store,
        },
        select: {
          stock: true,
        },
      });

      if (!product) throw new Error("Product not found");

      await tx.product.update({
        where: {
          id: id,
          store_id: user.store,
        },
        data: {
          stock: validated.stock,
        },
      });

      await tx.stock.create({
        data: {
          note: validated.note,
          state: StockState.SUCCESS,
          store_id: user.store,
          creator_id: user.employeeId,
          products: {
            create: {
              product_id: id,
              stock_after: validated.stock,
              stock_before: product.stock,
            },
          },
        },
      });
    });

    return { success: true, data: validated };
  } catch (error) {
    return ActionError(error) as ActionResponse<ProductUpdateStockValues>;
  }
};

export default UpdateStock;
