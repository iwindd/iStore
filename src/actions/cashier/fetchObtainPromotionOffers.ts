"use server";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { Prisma } from "@prisma/client";

export type ObtainPromotionOffer = Prisma.PromotionOfferGetPayload<{
  select: {
    id: true;
    buyItems: {
      select: {
        id: true;
        quantity: true;
        product_id: true;
      };
    };
    getItems: {
      select: {
        id: true;
        quantity: true;
        product: {
          select: {
            label: true;
            price: true;
            id: true;
            stock: true;
            category: {
              select: {
                overstock: true;
              };
            };
          };
        };
        product_id: true;
      };
    };
    event: {
      select: {
        id: true;
        title: true;
        description: true;
        start_at: true;
        end_at: true;
      };
    };
  };
}>;

const fetchObtainPromotionOffer = async (
  products: {
    id: number;
    quantity: number;
  }[]
): Promise<ObtainPromotionOffer[]> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    const result = await db.promotionOffer.findMany({
      where: {
        event: {
          store_id: user.store,
        },
        buyItems: {
          every: {
            OR: products.map((product) => ({
              product_id: product.id,
              quantity: {
                lte: product.quantity,
              },
            })),
          },
        },
      },
      select: {
        id: true,
        buyItems: {
          select: {
            id: true,
            quantity: true,
            product_id: true,
          },
        },
        getItems: {
          select: {
            id: true,
            quantity: true,
            product: {
              select: {
                id: true,
                label: true,
                price: true,
                stock: true,
                category: {
                  select: {
                    overstock: true,
                  },
                },
              },
            },
            product_id: true,
          },
        },
        event: {
          select: {
            id: true,
            title: true,
            description: true,
            start_at: true,
            end_at: true,
          },
        },
      },
    });

    return result;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default fetchObtainPromotionOffer;
