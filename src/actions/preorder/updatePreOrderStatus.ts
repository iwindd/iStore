"use server";

import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { PreOrderStatus, ProductStockMovementType } from "@prisma/client";
import { removeProductStock } from "../product/stock";

const updatePreOrderStatus = async (
  storeSlug: string,
  id: number,
  status: PreOrderStatus,
) => {
  const ctx = await getPermissionContext(storeSlug);
  assertStoreCan(ctx, PermissionConfig.store.preorder.updateStatus);

  await db.$transaction(async (tx) => {
    // Verify the preorder belongs to the user's store and get product info
    const preorder = await tx.orderPreOrder.findFirst({
      where: {
        id: id,
        order: {
          store_id: ctx.storeId!,
        },
      },
      include: {
        product: {
          include: {
            stock: true,
          },
        },
      },
    });

    if (!preorder) {
      throw new Error("PreOrder not found");
    }

    // If updating to RETURNED, check and deduct stock
    if (
      status === PreOrderStatus.RETURNED &&
      preorder.status !== PreOrderStatus.RETURNED
    ) {
      const stockCount = preorder.product.stock?.quantity || 0;
      if (stockCount < preorder.count) {
        throw new Error(
          `สต๊อกสินค้าไม่เพียงพอ (คงเหลือ ${stockCount} แต่ต้องการ ${preorder.count})`,
        );
      }

      // Deduct stock and record movement
      await removeProductStock(
        preorder.product_id,
        preorder.count,
        ProductStockMovementType.SALE,
        { order_id: preorder.order_id },
        tx,
      );
    }

    // Update the status
    await tx.orderPreOrder.update({
      where: { id: id },
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

export default updatePreOrderStatus;
