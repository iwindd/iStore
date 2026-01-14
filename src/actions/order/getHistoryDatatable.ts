"use server";

import { TableFetch } from "@/components/Datatable";
import { HistoryPermissionEnum } from "@/enums/permission";
import db from "@/libs/db";
import { getUser } from "@/libs/session";

const getHistoryDatatable = async (table: TableFetch) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    const {data, total} = await db.order.datatableFetch({
      table: table,
      filter: ["note"],
      select: {
        id: true,
        total: true,
        cost: true,
        profit: true,
        note: true,
        created_at: true,
        products: {
          take: 3,
          select: {
            count: true,
            product: {
              select: {
                label: true,
              },
            },
          },
        },
        creator: {
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
        store_id: user.store,
        creator_id: user.limitPermission(HistoryPermissionEnum.READ),
      },
    });

    return {
      data: data.map((order: any) => ({
        ...order,
        total: Number(order.total),
        cost: Number(order.cost),
        profit: Number(order.profit),
      })),
      total
    };
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default getHistoryDatatable;
