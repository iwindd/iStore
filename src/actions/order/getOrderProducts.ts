"use server";

import { TableFetch } from "@/components/Datatable";
import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";
import {
  assertStore,
  ifNotHasStorePermission,
} from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";

const getOrderProducts = async (table: TableFetch, orderId: number) => {
  try {
    const ctx = await getPermissionContext();
    assertStore(ctx);

    const { data, total } = await db.orderProduct.getDatatable({
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
      },
      where: {
        order: {
          id: orderId,
          store_id: ctx.storeId!,
          creator_id: ifNotHasStorePermission(
            ctx,
            PermissionConfig.store.history.getOrderProducts,
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

export default getOrderProducts;
