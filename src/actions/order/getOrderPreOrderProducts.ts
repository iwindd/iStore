"use server";

import { TableFetch } from "@/components/Datatable";
import db from "@/libs/db";
import { getUser } from "@/libs/session";

const getOrderPreOrderProducts = async (table: TableFetch, orderId: number) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    const { data, total } = await db.orderPreOrder.datatableFetch({
      table: table,
      filter: ["note"],
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
        order_id: orderId,
        order: {
          store_id: user.store,
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
