"use server";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { Prisma } from "@prisma/client";

type MostSoldProduct = Prisma.ProductGetPayload<{
  where: {
    OR: [
      {
        AND: [
          {
            category: {
              overstock: true;
            };
          },
        ];
      },
      {
        AND: [
          {
            stock: {
              gt: 0;
            };
          },
          {
            category: {
              overstock: false;
            };
          },
        ];
      },
      {
        AND: [
          {
            stock: {
              gt: 0;
            };
          },
          {
            category: null;
          },
        ];
      },
    ];
  };
  select: {
    id: true;
    serial: true;
    label: true;
    stock: true;
    category: {
      select: {
        label: true;
        overstock: true;
      };
    };
  };
}>;

const fetchMostSoldProducts = async (): Promise<MostSoldProduct[]> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    const products = await db.product.findMany({
      select: {
        id: true,
        serial: true,
        label: true,
        stock: true,
        category: {
          select: {
            label: true,
            overstock: true,
          },
        },
      },
      orderBy: {
        sold: "desc",
      },
      where: {
        store_id: user.store,
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
                  quantity: {
                    gt: 0,
                  },
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
                  quantity: {
                    gt: 0,
                  },
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
    });

    // Idk why but is need to cast type to MostSoldProduct
    return products as unknown as MostSoldProduct[];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default fetchMostSoldProducts;
