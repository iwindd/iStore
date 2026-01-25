"use server";

import {
  StockLayoutSelect,
  StockLayoutValue,
} from "@/app/projects/[store]/(products)/stocks/[id]/layout";
import { StorePermissionEnum } from "@/enums/permission";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { StockValues } from "@/schema/Stock";
import { StockReceiptStatus } from "@prisma/client";
import { setStockProduct } from "./setStockProduct";
import { updateProductStock } from "./updateProductStock";

const updateStock = async (
  storeSlug: string,
  payload: StockValues,
  stockId: number,
): Promise<StockLayoutValue> => {
  try {
    const ctx = await getPermissionContext(storeSlug);
    assertStoreCan(ctx, StorePermissionEnum.PRODUCT_MANAGEMENT);

    const stock = await db.stockReceipt.update({
      where: {
        id: stockId,
        status: StockReceiptStatus.DRAFT,
      },
      data: {
        note: payload.note,
        status: StockReceiptStatus.CREATING,
        store_id: ctx.storeId!,
        creator_id: ctx.employeeId!,
      },
    });

    await setStockProduct(stock.id, payload.products, true);

    const drafted = await db.stockReceipt.update({
      where: { id: stock.id },
      data: { status: StockReceiptStatus.DRAFT },
      select: StockLayoutSelect,
    });

    if (payload.update) {
      return await updateProductStock(stock.id);
    }

    return drafted;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default updateStock;
