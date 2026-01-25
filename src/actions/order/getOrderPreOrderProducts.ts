"use server";

import { TableFetch } from "@/components/Datatable";
import { StorePermissionEnum } from "@/enums/permission";
import db from "@/libs/db";
import {
  assertStore,
  ifNotHasStorePermission,
} from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";

const getOrderPreOrderProducts = async (table: TableFetch, orderId: number) => {
  try {
    const ctx = await getPermissionContext(table.storeIdentifier);
    assertStore(ctx);

    const { data, total } = await db.orderPreOrder.getDatatable({
      query: table,
      searchable: {
        note: {
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        count: true,
        total: true,
        cost: true,
        profit: true,
        note: true,
        status: true,
        returned_at: true,
        cancelled_at: true,
        product: {
          select: {
            serial: true,
            label: true,
            category: {
              select: {
                label: true,
              },
            },
          },
        },
        returned_by: {
          select: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        cancelled_by: {
          select: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      where: {
        order: {
          id: orderId,
          store_id: ctx.storeId!,
          creator_id: ifNotHasStorePermission(
            ctx,
            StorePermissionEnum.HISTORY_READ_ALL,
          ),
        },
      },
    });

    return {
      data: data.map((item: any) => ({
        ...item,
        total: Number(item.total),
        cost: Number(item.cost),
        profit: Number(item.profit),
      })),
      total,
    };
  } catch (error) {
    console.error(error);
    return { data: [], total: 0 };
  }
};

export default getOrderPreOrderProducts;
