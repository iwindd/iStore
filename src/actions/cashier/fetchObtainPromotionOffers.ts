"use server";
import { PermissionConfig } from "@/config/permissionConfig";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { CashoutHelper } from "./cashout-helpers";

export type ObtainPromotionOffer = Awaited<
  ReturnType<typeof fetchObtainPromotionOffer>
>[number];

const fetchObtainPromotionOffer = async (
  products: {
    id: number;
    quantity: number;
  }[],
  storeSlug: string,
) => {
  try {
    const ctx = await getPermissionContext(storeSlug);
    assertStoreCan(ctx, PermissionConfig.store.cashier.getObtainPromotionOffer);

    const result = await CashoutHelper.getObtainPromotionBuyXGetY(
      products,
      ctx.storeId!,
    );

    return result.map((item) => ({
      ...item,
      getItems: item.getItems.map((item) => ({
        ...item,
        product: {
          ...item.product,
          price: item.product.price.toNumber(),
        },
      })),
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default fetchObtainPromotionOffer;
