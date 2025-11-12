"use server";
import { HistoryPermissionEnum } from "@/enums/permission";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { Product } from "@prisma/client";

const getMostSoldProducts = async (): Promise<Product[]> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    const products = await db.product.findMany({
      orderBy: {
        sold: "desc",
      },
      where: {
        store_id: user.store,
        creator_id: user.limitPermission(HistoryPermissionEnum.READ),
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

    return products as Product[];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default getMostSoldProducts;
