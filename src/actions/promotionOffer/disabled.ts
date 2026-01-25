"use server";
import { StorePermissionEnum } from "@/enums/permission";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";

const DisablePromotionOffer = async (storeSlug: string, id: number) => {
  const ctx = await getPermissionContext(storeSlug);
  assertStoreCan(ctx, StorePermissionEnum.PROMOTION_MANAGEMENT);

  await db.promotionOffer.update({
    where: {
      id: id,
      event: {
        store_id: ctx.storeId!,
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
};

export default DisablePromotionOffer;
