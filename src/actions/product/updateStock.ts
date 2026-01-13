"use server";
import { ProductPermissionEnum } from "@/enums/permission";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import {
  ProductUpdateStockSchema,
  ProductUpdateStockValues,
} from "@/schema/Product";
import { ProductStockMovementType, StockReceiptStatus } from "@prisma/client";
import { setProductStock } from "./stock";

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
    const product = await db.product.findUniqueOrThrow({
      where: {
        id: id,
        store_id: user.store,
      },
      select: {
        id: true,
        stock: true,
      },
    });

    const stockReceipt = await db.stockReceipt.create({
      data: {
        note: validated.note,
        status: StockReceiptStatus.COMPLETED,
        store_id: user.store,
        creator_id: user.employeeId,
        stock_recept_products: {
          create: {
            quantity: validated.stock,
            product_id: product.id,
          },
        },
      },
    });

    await setProductStock(
      id,
      validated.stock,
      ProductStockMovementType.ADJUST,
      {
        stock_receipt_id: stockReceipt.id,
      }
    );

    return { success: true, data: validated };
  } catch (error) {
    console.error(error);
    return ActionError(error) as ActionResponse<ProductUpdateStockValues>;
  }
};

export default UpdateStock;
