import { CartProduct } from "@/reducers/cartReducer";
import { Prisma } from "@prisma/client";

type PromotionItemOffer = Prisma.PromotionOfferBuyItemGetPayload<{
  select: {
    product_id: true;
    quantity: true;
  };
}>;

const isSuccessCondition = (
  buyItems: PromotionItemOffer[],
  items: Pick<CartProduct, "id" | "quantity">[]
): boolean => {
  for (const buyItem of buyItems) {
    const cartItem = items.find((item) => item.id === buyItem.product_id);
    if (!cartItem) return false;
    if (cartItem.quantity < buyItem.quantity) return false;
  }

  return true;
};

export const getPromotionQuantities = (
  buyItems: PromotionItemOffer[],
  getItems: PromotionItemOffer[],
  items: Pick<CartProduct, "id" | "quantity">[]
): { id: number; quantity: number }[] => {
  if (!isSuccessCondition(buyItems, items)) return [];

  const result: { id: number; quantity: number }[] = [];

  for (const getItem of getItems) {
    result.push({
      id: getItem.product_id,
      quantity:
        getItem.quantity *
          Math.min(
            ...buyItems.map((buy) => {
              const cartItem = items.find((item) => item.id === buy.product_id);
              if (!cartItem) return 0;
              return Math.floor(cartItem.quantity / buy.quantity);
            })
          ) || 0,
    });
  }

  return result;
};

export const getQuantityByItem = (
  product_id: number,
  buyItems: PromotionItemOffer[],
  getItems: PromotionItemOffer[],
  items: Pick<CartProduct, "id" | "quantity">[]
): number => {
  const promotionQuantities = getPromotionQuantities(buyItems, getItems, items);
  const productPromotion = promotionQuantities.find(
    (promo) => promo.id === product_id
  );

  return productPromotion ? productPromotion.quantity : 0;
};
