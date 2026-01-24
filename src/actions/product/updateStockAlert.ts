"use server";
import { StorePermissionEnum } from "@/enums/permission";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import {
  ProductStockAlertSchema,
  ProductStockAlertValues,
} from "@/schema/Product";

const updateStockAlert = async (
  storeSlug: string,
  payload: ProductStockAlertValues & { id: number },
) => {
  const ctx = await getPermissionContext(storeSlug);
  assertStoreCan(ctx, StorePermissionEnum.PRODUCT_MANAGEMENT);
  const validated = ProductStockAlertSchema.parse(payload);

  const stockAlert = await db.productStock.upsert({
    where: { product_id: payload.id },
    create: {
      product_id: payload.id,
      alertCount: validated.alertCount,
      useAlert: validated.useAlert,
    },
    update: {
      alertCount: validated.alertCount,
      useAlert: validated.useAlert,
    },
  });

  return stockAlert;
};

export default updateStockAlert;
