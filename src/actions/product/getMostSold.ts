"use server";
import { HistoryPermissionEnum } from "@/enums/permission";
import { CartProduct } from "@/hooks/use-cart";
import db from "@/libs/db";
import { getUser } from "@/libs/session";

const getMostSoldProducts = async (): Promise<CartProduct[]> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    const products = await db.product.findMany({
      orderBy: {
        sold: "desc",
      },
      where: {
        store_id: user.store,
        user_store_id: !user.hasPermission(HistoryPermissionEnum.READ)
          ? user.userStoreId
          : undefined,
        sold: {
          gt: 0,
        },
        OR: [
          {
            AND: [
              {
                category: {
                  overstock: true,
                },
              },
            ],
          },
          {
            AND: [
              {
                stock: {
                  gt: 0,
                },
              },
              {
                category: {
                  overstock: false,
                },
              },
            ],
          },
          {
            AND: [
              {
                stock: {
                  gt: 0,
                },
              },
              {
                category: null,
              },
            ],
          },
        ],
      },
      take: 10,
      include: {
        category: {
          select: {
            overstock: true,
          },
        },
      },
    });

    return products as CartProduct[];
  } catch (error) {
    return [];
  }
};

export default getMostSoldProducts;
