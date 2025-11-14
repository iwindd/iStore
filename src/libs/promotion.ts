import { CartProduct } from "@/reducers/cartReducer";
import { Prisma } from "@prisma/client";

type PromotionItemOffer = Prisma.PromotionOfferBuyItemGetPayload<{
  select: {
    product_id: true;
    quantity: true;
  };
}>;

const getPromotionQuantities = (
  buyItems: PromotionItemOffer[],
  getItems: PromotionItemOffer[],
  items: Pick<CartProduct, "id" | "quantity">[]
): { id: number; quantity: number }[] => {
  const result: { id: number; quantity: number }[] = [];

  for (const get of getItems) {
    const correspondingBuyItem = buyItems.find(
      (buy) => buy.product_id === get.product_id
    );

    if (correspondingBuyItem) {
      const cartItem = items.find(
        (item) => item.id === correspondingBuyItem.product_id
      );
      if (cartItem) {
        const multiplier = Math.floor(
          cartItem.quantity / correspondingBuyItem.quantity
        );
        result.push({
          id: get.product_id,
          quantity: get.quantity * multiplier,
        });
      }
    }
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
