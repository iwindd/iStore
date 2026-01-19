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
  payload: UpdatePromotionOfferValues,
): Promise<ActionResponse<unknown>> => {
  try {
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
            disabled_at: true,
          },
        },
      },
    });

    if (!oldPromotionOffer) throw new Error("Promotion offer not found");
    if (oldPromotionOffer.event.disabled_at !== null)
      throw new Error("Promotion offer is disabled");
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
            name: validated.name,
            note: validated.note,
            start_at: dayjs(validated.start_at).startOf("day").toDate(),
            end_at: dayjs(validated.end_at).endOf("day").toDate(),
          },
        },
        ...(!isStarted && {
          buyItems: {
            deleteMany: {},
            create: validated.needProducts.map((item) => ({
              product_id: item.product_id,
              quantity: item.quantity,
            })),
          },
          getItems: {
            deleteMany: {},
            create: validated.offerProducts.map((item) => ({
              product_id: item.product_id,
              quantity: item.quantity,
            })),
          },
        }),
      },
    });

    return { success: true, data: promotionOffer };
  } catch (error) {
    console.error("Error updating promotion offer:", error);
    return ActionError(error) as ActionResponse<unknown>;
  }
};

export default UpdatePromotionOffer;
