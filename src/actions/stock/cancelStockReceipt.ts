"use server";
import { StorePermissionEnum } from "@/enums/permission";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { StockReceiptStatus } from "@prisma/client";

const cancelStockReceipt = async (id: number, storeSlug: string) => {
  const ctx = await getPermissionContext(storeSlug);
  assertStoreCan(ctx, StorePermissionEnum.PRODUCT_MANAGEMENT);
  const data = await db.stockReceipt.update({
    where: {
      id: id,
      store_id: ctx.storeId,
    },
    data: {
      status: StockReceiptStatus.CANCEL,
      action_at: new Date(),
    },
  });

  return { success: true, data: data };
};

export default cancelStockReceipt;
