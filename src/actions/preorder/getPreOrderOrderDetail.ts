"use server";

import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { PreOrderStatus } from "@prisma/client";

export type PreOrderOrderStatus = PreOrderStatus | "COMPLETED" | "UNKNOWN";

const getPreOrderOrderDetail = async (storeSlug: string, orderId: number) => {
  try {
    const ctx = await getPermissionContext(storeSlug);
    assertStoreCan(ctx, PermissionConfig.store.preorder.getDatatable);

    const order = await db.order.findFirst({
      where: {
        id: orderId,
        store_id: ctx.storeId!,
        preOrders: {
          some: {}, // Only orders that have preorders
        },
      },
      select: {
        id: true,
        created_at: true,
        total: true,
        cost: true,
        profit: true,
        note: true,
        creator: {
          select: {
            user: {
              select: {
                first_name: true,
                last_name: true,
              },
            },
          },
        },
        preOrders: {
          select: {
            id: true,
            status: true,
            count: true,
            product: {
              select: {
                id: true,
                stock: {
                  select: {
                    quantity: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!order) return null;

    // Calculate aggregated status
    const preOrders = order.preOrders;
    const status: PreOrderOrderStatus = preOrders.every(
      (p) => p.status === "RETURNED" || p.status === "CANCELLED",
    )
      ? "COMPLETED"
      : preOrders.some((p) => p.status === "PENDING")
        ? "PENDING"
        : "UNKNOWN";

    return {
      ...order,
      total: Number(order.total),
      cost: Number(order.cost),
      profit: Number(order.profit),
      itemsCount: preOrders.length,
      status,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default getPreOrderOrderDetail;
