"use server";

import { TableFetch } from "@/components/Datatable";
import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { OrderPreOrder } from "@prisma/client";

const getPreOrderOrdersDatatable = async (table: TableFetch) => {
  try {
    const ctx = await getPermissionContext(table.storeIdentifier);
    assertStoreCan(ctx, PermissionConfig.store.preorder.getDatatable);

    const { data, total } = await db.order.getDatatable({
      query: {
        ...table,
        sort: table.sort || {
          created_at: "desc",
        },
      },
      searchable: {
        note: {
          mode: "insensitive",
        },
        // We can add search by order ID if needed, but db.order.getDatatable might not support searching by ID directly if it's int.
        // Usually db.getDatatable handles string fields well.
      },
      select: {
        id: true,
        created_at: true,
        total: true,
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
            total: true,
            product: {
              select: {
                label: true,
              },
            },
          },
        },
      },
      where: {
        store_id: ctx.storeId!,
        preOrders: {
          some: {}, // Only orders that have preorders
        },
      },
    });

    return {
      data: data.map((order) => {
        // Summarize preorders
        const preOrders = order.preOrders as Partial<OrderPreOrder>[];
        const status = preOrders.every(
          (p) => p.status === "RETURNED" || p.status === "CANCELLED",
        )
          ? "COMPLETED"
          : preOrders.some((p) => p.status === "PENDING")
            ? "PENDING"
            : "UNKNOWN";

        return {
          ...order,
          itemsCount: preOrders.length,
          total: Number(order.total),
          status,
          preOrders: preOrders.map((p) => ({
            ...p,
            cost: Number(p.cost),
            profit: Number(p.profit),
            total: Number(p.total),
          })),
        };
      }),
      total: Number(total),
    };
  } catch (error) {
    console.error(error);
    return { data: [], total: 0 };
  }
};

export default getPreOrderOrdersDatatable;
