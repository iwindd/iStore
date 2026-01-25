"use server";

import { StorePermissionEnum } from "@/enums/permission";
import BotApp from "@/libs/botapp";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";

export const generateAdMessage = async (
  storeSlug: string,
  promotionId: number,
) => {
  try {
    const ctx = await getPermissionContext(storeSlug);
    assertStoreCan(ctx, StorePermissionEnum.BROADCAST_MANAGEMENT);
    const event = await db.event.findFirstOrThrow({
      where: {
        id: promotionId,
        store_id: ctx.storeId,
      },
      select: {
        offers: {
          select: {
            buyItems: {
              select: {
                product: {
                  select: {
                    label: true,
                  },
                },
                quantity: true,
              },
            },
            getItems: {
              select: {
                product: {
                  select: {
                    label: true,
                  },
                },
                quantity: true,
              },
            },
          },
        },
      },
    });
    /* 

buyItems [
  { product: { label: 'วอลล์คัพช็อกซิป VI 24*90ML 48' }, quantity: 1 }
]*/
    const buyItems = event.offers.flatMap((offer) => offer.buyItems) || [];

    const payload = {
      promotionType: "buyXgetY",
      buyProducts: buyItems.map((item) => ({
        name: item.product.label,
        quantity: item.quantity,
      })),
      getProducts: event.offers
        .flatMap((offer) => offer.getItems)
        .map((item) => ({
          name: item.product.label,
          quantity: item.quantity,
        })),
    };

    if (!event) {
      throw new Error("Promotion event not found");
    }

    const response = await BotApp.post(
      "/assistant/generate/ad-message",
      payload,
    );

    return response.data.message;
  } catch (error) {
    console.error("Error sending broadcast:", error);
    throw error;
  }
};
