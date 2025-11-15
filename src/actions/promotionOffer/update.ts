"use server";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import {
  UpdatePromotionOfferSchema,
  UpdatePromotionOfferValues,
} from "@/schema/Promotion/Offer";
import dayjs from "dayjs";

const UpdatePromotionOffer = async (
  id: number,
  payload: UpdatePromotionOfferValues
): Promise<ActionResponse<unknown>> => {
  try {
    console.warn(
      "Updating promotion offer with id:",
      id,
      "and payload:",
      payload
    );
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    const validated = UpdatePromotionOfferSchema.parse(payload);

    const oldPromotionOffer = await db.promotionOffer.findUnique({
      where: {
        id: id,
        event: {
          store_id: user.store,
        },
      },
      select: {
        event: {
          select: {
            start_at: true,
            end_at: true,
          },
        },
      },
    });

    if (!oldPromotionOffer) throw new Error("Promotion offer not found");
    const isStarted = dayjs().isAfter(dayjs(oldPromotionOffer.event.start_at));
    const isEnded = dayjs().isAfter(dayjs(oldPromotionOffer.event.end_at));

    if (isStarted) {
      validated.start_at = oldPromotionOffer.event.start_at;
    } else if (isEnded) {
      validated.end_at = oldPromotionOffer.event.end_at;
    }

    const promotionOffer = await db.promotionOffer.update({
      where: {
        id: id,
        event: {
          store_id: user.store,
        },
      },
      data: {
        event: {
          update: {
            title: validated.title,
            description: validated.description,
            start_at: validated.start_at,
            end_at: validated.end_at,
          },
        },
        ...(!isStarted && {
          buyItems: {
            set: [],
            create: validated.needProducts.map((item) => ({
              product_id: item.product_id,
              quantity: item.quantity,
            })),
          },
          getItems: {
            set: [],
            create: validated.offerProducts.map((item) => ({
              product_id: item.product_id,
              quantity: item.quantity,
            })),
          },
        }),
      },
    });

    console.log("updated promotion offer", promotionOffer);

    return { success: true, data: promotionOffer };
  } catch (error) {
    console.error("Error updating promotion offer:", error);
    return ActionError(error) as ActionResponse<unknown>;
  }
};

export default UpdatePromotionOffer;
