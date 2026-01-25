"use server";
import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
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
  storeSlug: string,
  payload: AddPromotionOfferValues,
) => {
  const ctx = await getPermissionContext(storeSlug);
  assertStoreCan(ctx, PermissionConfig.store.promotion.createOffer);
  const validated = AddPromotionOfferSchema.parse(payload);

  const promotionOffer = await db.event.create({
    data: {
      name: validated.name,
      note: validated.note,
      start_at: dayjs(validated.start_at).startOf("day").toDate(),
      end_at: dayjs(validated.end_at).endOf("day").toDate(),
      creator_id: ctx.employeeId!,
      store_id: ctx.storeId!,
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
    },
  });

  return promotionOffer;
};

export default CreatePromotionOffer;
