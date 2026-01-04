"use server";

import BotApp from "@/libs/botapp";
import db from "@/libs/db";
import { getUser } from "@/libs/session";

export const generateAdMessage = async (promotionId: number) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    const event = await db.event.findFirstOrThrow({
      where: {
        id: promotionId,
        store_id: user.store,
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
      payload
    );

    return response.data.message;
  } catch (error) {
    console.error("Error sending broadcast:", error);
    throw error;
  }
};
