"use server";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import {
  AddPromotionOfferSchema,
  AddPromotionOfferValues,
} from "@/schema/Promotion/Offer";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";

export type CreatedPromotionOffer = Prisma.PromotionOfferGetPayload<{
  select: {
    id: true;
    note: true;
    start_at: true;
    end_at: true;
    disabled_at: true;
    creator: {
      select: {
        user: {
          select: {
            name: true;
          };
        };
      };
    };
    offers: {
      select: {
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
      };
    };
  };
}>;

const CreatePromotionOffer = async (
  payload: AddPromotionOfferValues
): Promise<ActionResponse<CreatedPromotionOffer>> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    const validated = AddPromotionOfferSchema.parse(payload);

    const promotionOffer = await db.event.create({
      data: {
        note: validated.note,
        start_at: dayjs(validated.start_at).startOf("day").toDate(),
        end_at: dayjs(validated.end_at).endOf("day").toDate(),
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
      select: {
        id: true,
        note: true,
        start_at: true,
        end_at: true,
        disabled_at: true,
        creator: {
          select: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        offers: {
          select: {
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
          },
        },
      },
    });

    return { success: true, data: promotionOffer as CreatedPromotionOffer };
  } catch (error) {
    return ActionError(error) as ActionResponse<CreatedPromotionOffer>;
  }
};

export default CreatePromotionOffer;
