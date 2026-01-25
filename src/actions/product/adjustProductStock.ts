"use server";
import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";

import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import {
  ProductAdjustStockSchema,
  ProductAdjustStockValues,
} from "@/schema/Product";
import { ProductStockMovementType, StockReceiptStatus } from "@prisma/client";

const adjustProductStock = async (
  storeSlug: string,
  payload: ProductAdjustStockValues & { id: number },
) => {
  const ctx = await getPermissionContext(storeSlug);
  assertStoreCan(ctx, PermissionConfig.store.product.adjustStock);
  const validated = ProductAdjustStockSchema.parse(payload);
  const product = await db.product.findUniqueOrThrow({
    where: {
      id: payload.id,
      store_id: ctx.storeId!,
    },
    select: {
      id: true,
      stock: true,
    },
  });

  return await db.$transaction(async (tx) => {
    const stockReceipt = await tx.stockReceipt.create({
      data: {
        note: validated.note,
        status: StockReceiptStatus.COMPLETED,
        store_id: ctx.storeId!,
        creator_id: ctx.employeeId!,
        stock_recept_products: {
          create: {
            quantity: validated.stock,
            product_id: product.id,
          },
        },
      },
    });

    const updatedStock = await tx.productStock.upsert({
      where: { id: product.stock?.id },
      create: {
        product_id: product.id,
        quantity: validated.stock,
      },
      update: {
        quantity: validated.stock,
      },
    });

    return await tx.productStockMovement.create({
      data: {
        product_id: product.id,
        quantity: validated.stock,
        quantity_before: product.stock?.quantity || 0,
        quantity_after: updatedStock.quantity,
        type: ProductStockMovementType.ADJUST,
        stock_receipt_id: stockReceipt.id,
      },
      select: {
        quantity_after: true,
      },
    });
  });
};

export default adjustProductStock;
