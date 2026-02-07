"use server";
import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";

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

    const result = await db.promotionOffer.findMany({
      where: {
        event: {
          store_id: ctx.storeId,
          start_at: { lte: new Date() },
          end_at: { gte: new Date() },
          disabled_at: null,
        },

        buyItems: {
          every: {
            OR: products.map((product) => ({
              product_id: product.id,
              quantity: {
                lte: product.quantity,
              },
            })),
          },
        },
      },
      select: {
        id: true,
        buyItems: {
          select: {
            id: true,
            quantity: true,
            product_id: true,
          },
        },
        getItems: {
          select: {
            id: true,
            quantity: true,
            product: {
              select: {
                id: true,
                label: true,
                serial: true,
                price: true,
                stock: true,
              },
            },
            product_id: true,
          },
        },
        event: {
          select: {
            id: true,
            start_at: true,
            end_at: true,
          },
        },
      },
    });

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
