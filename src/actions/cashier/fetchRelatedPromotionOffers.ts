"use server";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { Prisma } from "@prisma/client";

export type RelatedPromotionOffer = Prisma.PromotionOfferGetPayload<{
  select: {
    id: true;
    getItems: {
      select: {
        quantity: true;
        product: {
          select: {
            label: true;
          };
        };
      };
    };
    buyItems: {
      select: {
        quantity: true;
        product: {
          select: {
            label: true;
          };
        };
      };
    };
    event: {
      select: {
        id: true;
        start_at: true;
        end_at: true;
      };
    };
  };
}>;

const fetchRelatedPromotionOffer = async (
  productIds: number[]
): Promise<RelatedPromotionOffer[]> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    const result = await db.promotionOffer.findRelatedPromotionOffer({
      productIds,
      where: {
        event: {
          store_id: user.store,
        },
      },
      select: {
        id: true,
        getItems: {
          select: {
            quantity: true,
            product: {
              select: {
                label: true,
              },
            },
          },
        },
        buyItems: {
          select: {
            quantity: true,
            product: {
              select: {
                label: true,
              },
            },
          },
        },
        event: {
          select: {
            id: true,
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

export default fetchRelatedPromotionOffer;
