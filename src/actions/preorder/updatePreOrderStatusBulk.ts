"use server";

import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { PreOrderStatus, ProductStockMovementType } from "@prisma/client";

const updatePreOrderStatusBulk = async (
  storeSlug: string,
  ids: number[],
  status: PreOrderStatus,
) => {
  const ctx = await getPermissionContext(storeSlug);
  assertStoreCan(ctx, PermissionConfig.store.preorder.updateStatus);

  await db.$transaction(async (tx) => {
    // Verify the preorder belongs to the user's store and get product info
    const preorders = await tx.orderPreOrder.findMany({
      where: {
        id: {
          in: ids,
        },
        order: {
          store_id: ctx.storeId!,
        },
        status: PreOrderStatus.PENDING,
      },
    });

    if (preorders.length <= 0) {
      throw new Error("PreOrder not found");
    }

    // If updating to RETURNED, check and deduct stock
    if (status === PreOrderStatus.RETURNED) {
      // Batch-fetch all product stocks in a single query and upsert only
      // the missing ones. This reduces per-preorder queries from 3N to
      // N + a small constant.
      const preorderProductIds = preorders.map((p) => p.product_id);
      const existingStocks = await tx.productStock.findMany({
        where: { product_id: { in: preorderProductIds } },
        select: { id: true, quantity: true, product_id: true, product: { select: { label: true } } },
      });
      const stockMap = new Map(existingStocks.map((s) => [s.product_id, s]));

      const missingProductIds = preorderProductIds.filter(
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
          select: { id: true, quantity: true, product_id: true, product: { select: { label: true } } },
        });
        newStocks.forEach((s) => stockMap.set(s.product_id, s));
      }

      // Validate all stock levels before making any changes
      for (const preorder of preorders) {
        const productStock = stockMap.get(preorder.product_id)!;
        if (productStock.quantity < preorder.count) {
          throw new Error(
            `สต๊อกสินค้า ${productStock.product.label} ไม่เพียงพอ (คงเหลือ ${productStock.quantity} แต่ต้องการ ${preorder.count})`,
          );
        }
      }

      // Batch-create all stock movement records
      await tx.productStockMovement.createMany({
        data: preorders.map((preorder) => {
          const productStock = stockMap.get(preorder.product_id)!;
          return {
            product_id: preorder.product_id,
            quantity: preorder.count,
            quantity_before: productStock.quantity,
            quantity_after: productStock.quantity - preorder.count,
            type: ProductStockMovementType.PREORDER_SOLD,
            order_id: preorder.order_id,
          };
        }),
      });

      for (const preorder of preorders) {
        const productStock = stockMap.get(preorder.product_id)!;
        await tx.productStock.update({
          where: {
            id: productStock.id,
            quantity: { gte: preorder.count },
          },
          data: { quantity: { decrement: preorder.count } },
        });
      }
    }

    // Update the status
    await tx.orderPreOrder.updateMany({
      where: { id: { in: ids } },
      data: {
        status: status,
        ...(status === PreOrderStatus.RETURNED && {
          returned_at: new Date(),
          returned_by_id: ctx.employeeId!,
        }),
        ...(status === PreOrderStatus.CANCELLED && {
          cancelled_at: new Date(),
          cancelled_by_id: ctx.employeeId!,
        }),
      },
    });
  });

  return status;
};

export default updatePreOrderStatusBulk;
