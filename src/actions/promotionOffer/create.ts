"use server";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import {
  AddPromotionOfferSchema,
  AddPromotionOfferValues,
} from "@/schema/Promotion/Offer";

export type CreatedPromotionOffer = {
  title: string;
  description: string | null;
  start_at: Date;
  end_at: Date;
  id: number;
  created_at: Date;
  updated_at: Date;
  store_id: string;
  creator_id: number | null;
};

const CreatePromotionOffer = async (
  payload: AddPromotionOfferValues
): Promise<ActionResponse<CreatedPromotionOffer>> => {
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

    return { success: true, data: promotionOffer };
  } catch (error) {
    return ActionError(error) as ActionResponse<CreatedPromotionOffer>;
  }
};

export default CreatePromotionOffer;
