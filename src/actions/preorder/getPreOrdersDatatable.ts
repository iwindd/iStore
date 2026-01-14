"use server";

import { TableFetch } from "@/components/Datatable";
import db from "@/libs/db";
import { getUser } from "@/libs/session";

const getPreOrdersDatatable = async (table: TableFetch) => {
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
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      where: {
        order: {
          store_id: user.store,
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
