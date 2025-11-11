"use server";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import {
  AddPromotionOfferSchema,
  AddPromotionOfferValues,
} from "@/schema/Promotion/Offer";

const CreatePromotionOffer = async (
  payload: AddPromotionOfferValues
): Promise<ActionResponse<null>> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    const validated = AddPromotionOfferSchema.parse(payload);

    const promotionOffer = await db.event.create({
      data: {
        title: validated.title,
        description: validated.description,
        start_at: validated.start_at,
        end_at: validated.end_at,
        creator_id: user.id,
        store_id: user.store,
        offers: {
          create: {
            buyItems: {
              create: validated.needProducts.map((item) => ({
                product_id: item.product_id,
                quantity: item.quantity,
              })),
            },
            getItems: {
              create: validated.offerProducts.map((item) => ({
                product_id: item.product_id,
                quantity: item.quantity,
              })),
            },
          },
        },
      },
    });

    return { success: true, data: null };
  } catch (error) {
    return ActionError(error) as ActionResponse<null>;
  }
};

export default CreatePromotionOffer;
