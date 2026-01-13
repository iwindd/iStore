"use server";
import { ProductPermissionEnum } from "@/enums/permission";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import {
  ProductStockAlertSchema,
  ProductStockAlertValues,
} from "@/schema/Product";

const updateStockAlert = async (
  payload: ProductStockAlertValues,
  product_id: number
) => {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");
  if (!user.hasPermission(ProductPermissionEnum.UPDATE))
    throw new Error("Unauthorized");
  const validated = ProductStockAlertSchema.parse(payload);

  const stockAlert = await db.productStock.upsert({
    where: { product_id },
    create: {
      product_id,
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
