"use server";
import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { ConsignmentSchema, ConsignmentValues } from "@/schema/Payment";
import { ProductStockMovementType } from "@prisma/client";
import { validateProducts } from "./cashout";

export const Consignment = async (
  storeSlug: string,
  payload: ConsignmentValues,
) => {
  const ctx = await getPermissionContext(storeSlug);
  assertStoreCan(ctx, PermissionConfig.store.cashier.cashout);
  const validated = ConsignmentSchema.parse(payload);
  const { products } = await validateProducts(ctx.storeId!, validated.products);

  const consignment = await db.$transaction(async (tx) => {
    const consignment = await tx.consignment.create({
      data: {
        store_id: ctx.storeId!,
        creator_id: ctx.employeeId!,
        note: validated.note,
      },
    });

    // Create Order Products
    await tx.consigmentProduct.createMany({
      data: products.map((product) => ({
        consignment_id: consignment.id,
        product_id: product.id,
        note: product.note,
        quantityOut: product.quantity,
      })),
    });

    // Remove Product Stock
    // Batch-fetch all product stocks in a single query and upsert only the
    // missing ones, then batch-create movements. This reduces per-product
    // queries from 3N to N + a small constant.
    const consignmentProductIds = products.map((p) => p.id);
    const existingStocks = await tx.productStock.findMany({
      where: { product_id: { in: consignmentProductIds } },
    });
    const stockMap = new Map(existingStocks.map((s) => [s.product_id, s]));

    const missingProductIds = consignmentProductIds.filter(
      (id) => !stockMap.has(id),
    );
    if (missingProductIds.length > 0) {
      await tx.productStock.createMany({
        data: missingProductIds.map((product_id) => ({
          product_id,
          quantity: 0,
        })),
      });
      const newStocks = await tx.productStock.findMany({
        where: { product_id: { in: missingProductIds } },
      });
      newStocks.forEach((s) => stockMap.set(s.product_id, s));
    }

    // Validate stock levels before making any changes
    for (const product of products) {
      const stock = stockMap.get(product.id)!;
      if (stock.quantity < product.quantity) {
        throw new Error(`Product ${product.id} is out of stock`);
      }
    }

    await tx.productStockMovement.createMany({
      data: products.map((product) => {
        const stock = stockMap.get(product.id)!;
        return {
          consignment_id: consignment.id,
          product_id: product.id,
          type: ProductStockMovementType.CONSIGNMENT_SOLD,
          quantity: -product.quantity,
          quantity_before: stock.quantity,
          quantity_after: stock.quantity - product.quantity,
        };
      }),
    });

    for (const product of products) {
      await tx.productStock.update({
        where: { id: stockMap.get(product.id)!.id },
        data: { quantity: { decrement: product.quantity } },
      });
    }

    return consignment;
  });

  return {
    success: true,
    consignment: {
      ...consignment,
      created_at: consignment.created_at.toISOString(),
      updated_at: consignment.updated_at.toISOString(),
    },
  };
};
