"use server";

import { StorePermissionEnum } from "@/enums/permission";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";

const getPreOrderDetail = async (storeSlug: string, id: number) => {
  try {
    const ctx = await getPermissionContext(storeSlug);
    assertStoreCan(ctx, StorePermissionEnum.PREORDER_MANAGEMENT);

    const preorder = await db.orderPreOrder.findFirst({
      where: {
        id: id,
        order: {
          store_id: ctx.storeId!,
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
                    first_name: true,
                    last_name: true,
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
                first_name: true,
                last_name: true,
              },
            },
          },
        },
        cancelled_at: true,
        cancelled_by: {
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
