"use server";

import db from "@/libs/db";
import { getUser } from "@/libs/session";

const getPreOrderDetail = async (id: number) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    const preorder = await db.orderPreOrder.findFirst({
      where: {
        id: id,
        order: {
          store_id: user.store,
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
        product: {
          select: {
            id: true,
            label: true,
            serial: true,
            price: true,
            stock: {
              select: {
                quantity: true,
              },
            },
          },
        },
        order: {
          select: {
            id: true,
            created_at: true,
            note: true,
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
        returned_by: {
          select: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        cancelled_at: true,
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
    });

    if (!preorder) return null;

    return {
      ...preorder,
      total: Number(preorder.total),
      cost: Number(preorder.cost),
      profit: Number(preorder.profit),
      product: {
        ...preorder.product,
        price: Number(preorder.product.price),
      },
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default getPreOrderDetail;
