"use server";
import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
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
  productIds: number[],
  storeSlug: string,
): Promise<RelatedPromotionOffer[]> => {
  const ctx = await getPermissionContext(storeSlug);
  assertStoreCan(ctx, PermissionConfig.store.cashier.getRelatedPromotionOffer);

  const result = await db.promotionOffer.findRelatedPromotionOffer({
    productIds,
    where: {
      event: {
        store_id: ctx.storeId,
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
};

export default fetchRelatedPromotionOffer;
