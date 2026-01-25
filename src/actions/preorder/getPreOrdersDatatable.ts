"use server";

import { TableFetch } from "@/components/Datatable";
import { StorePermissionEnum } from "@/enums/permission";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";

const getPreOrdersDatatable = async (table: TableFetch) => {
  try {
    const ctx = await getPermissionContext(table.storeIdentifier);
    assertStoreCan(ctx, StorePermissionEnum.PREORDER_MANAGEMENT);

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
        product: {
          select: {
            id: true,
            label: true,
            serial: true,
          },
        },
        order: {
          select: {
            id: true,
            created_at: true,
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
          },
        },
      },
      where: {
        order: {
          store_id: ctx.storeId!,
        },
      },
    });

    return {
      data: data.map((preorder: any) => ({
        ...preorder,
        total: Number(preorder.total),
        cost: Number(preorder.cost),
        profit: Number(preorder.profit),
      })),
      total,
    };
  } catch (error) {
    console.error(error);
    return { data: [], total: 0 };
  }
};

export default getPreOrdersDatatable;
