"use server";
import { CashoutType } from "@/enums/cashout";
import { HistoryPermissionEnum } from "@/enums/permission";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { Prisma } from "@prisma/client";

const getHistoryDetail = async (id: number) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    const where: Prisma.OrderWhereInput = {
      id: id,
      store_id: user.store,
      OR: [
        {
          type: CashoutType.CASHOUT,
          creator_id: user.limitPermission(HistoryPermissionEnum.READ),
        },
        /* { // TODO:: DO SOMETHING WITH THIS SHIT
            type: CashoutType.CASHOUT,
            creator_id: user.limitPermission(OverStockPermissionEnum.READ),
            products: {
              some: {
                overstock: {
                  gte: 1,
                },
              },
            },
          },
          {
            type: CashoutType.PURCHASE,
            creator_id: user.limitPermission(PurchasePermissionEnum.READ),
          }, */
      ],
    };

    const history = await db.order.findFirstOrThrow({
      where,
      select: {
        id: true,
        total: true,
        cost: true,
        profit: true,
        note: true,
        creator_id: true,
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
        products: {
          select: {
            id: true,
            note: true,
            cost: true,
            profit: true,
            total: true,
            count: true,
            product: {
              select: {
                serial: true,
                label: true,
                category: true,
              },
            },
          },
        },
      },
    });

    return {
      ...history,
      products: history.products.map((p) => ({
        ...p,
        total: Number(p.total),
        cost: Number(p.cost),
        profit: Number(p.profit),
        product: {
          ...p.product,
        },
      })),
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default getHistoryDetail;
