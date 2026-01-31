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
      for (const preorder of preorders) {
        // find or create
        const productStock = await tx.productStock.upsert({
          where: {
            product_id: preorder.product_id,
          },
          create: {
            product: {
              connect: {
                id: preorder.product_id,
              },
            },
            quantity: 0,
          },
          update: {},
          select: {
            id: true,
            quantity: true,
            product: {
              select: {
                label: true,
              },
            },
          },
        });

        if (productStock.quantity < preorder.count) {
          throw new Error(
            `สต๊อกสินค้า ${productStock.product.label} ไม่เพียงพอ (คงเหลือ ${productStock.quantity} แต่ต้องการ ${preorder.count})`,
          );
        }

        const updatedProductStock = await tx.productStock.update({
          where: {
            id: productStock.id,
            quantity: {
              gte: preorder.count,
            },
          },
          data: {
            quantity: {
              decrement: preorder.count,
            },
          },
          select: {
            quantity: true,
          },
        });

        await tx.productStockMovement.create({
          data: {
            product_id: preorder.product_id,
            quantity: preorder.count,
            quantity_before: productStock.quantity,
            quantity_after: updatedProductStock.quantity,
            type: ProductStockMovementType.SALE, //TODO:: Change to PreOrderReturned
            order_id: preorder.order_id,
          },
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
