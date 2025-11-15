"use server";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";

const DisablePromotionOffer = async (
  id: number
): Promise<ActionResponse<null>> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    await db.promotionOffer.update({
      where: {
        id: id,
        event: {
          store_id: user.store,
        },
      },
      data: {
        event: {
          update: {
            disabled_at: new Date(),
          },
        },
      },
    });

    return { success: true, data: null };
  } catch (error) {
    return ActionError(error) as ActionResponse<null>;
  }
};

export default DisablePromotionOffer;
