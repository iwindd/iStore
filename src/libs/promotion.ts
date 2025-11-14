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

export const mergePromotionQuantities = (
  quantitiesList: {
    id: number;
    quantity: number;
    promotion_offer_id?: number;
  }[][]
): { id: number; quantity: number; promotion_offer_id: number[] }[] => {
  const mergedMap: Map<
    number,
    { id: number; quantity: number; promotion_offer_id: number[] }
  > = new Map();

  for (const quantities of quantitiesList) {
    for (const item of quantities) {
      if (mergedMap.has(item.id)) {
        const existing = mergedMap.get(item.id)!;
        existing.quantity += item.quantity;
        if (item.promotion_offer_id) {
          existing.promotion_offer_id.push(item.promotion_offer_id);
        }
      } else {
        mergedMap.set(item.id, {
          id: item.id,
          quantity: item.quantity,
          promotion_offer_id: item.promotion_offer_id
            ? [item.promotion_offer_id]
            : [],
        });
      }
    }
  }

  return Array.from(mergedMap.values());
};
