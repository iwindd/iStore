"use server";

import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { StockValues } from "@/schema/Stock";
import { StockReceiptStatus } from "@prisma/client";
import { setStockProduct } from "./setStockProduct";
import { updateProductStock } from "./updateProductStock";

const createStockReceipt = async (storeSlug: string, payload: StockValues) => {
  const ctx = await getPermissionContext(storeSlug);
  assertStoreCan(ctx, PermissionConfig.store.stock.createReceipt);

  const stock = await db.stockReceipt.create({
    data: {
      note: payload.note,
      status: StockReceiptStatus.CREATING,
      store_id: ctx.storeId!,
      creator_id: ctx.employeeId!,
    },
  });

  await setStockProduct(stock.id, payload.products);

  const drafted = await db.stockReceipt.update({
    where: { id: stock.id },
    data: { status: StockReceiptStatus.DRAFT },
  });

  if (payload.update) {
    return await updateProductStock(stock.id);
  }

  return drafted;
};

export default createStockReceipt;
