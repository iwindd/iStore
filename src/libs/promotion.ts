import { ObtainPromotionOffer } from "@/actions/cashier/fetchObtainPromotionOffers";
import { UseObtainPromotionOfferProps } from "@/hooks/useObtainPromotionOffer";
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
  items: Pick<CartProduct, "id" | "quantity">[],
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
  items: Pick<CartProduct, "id" | "quantity">[],
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
            }),
          ) || 0,
    });
  }

  return result;
};

export const getQuantityByItem = (
  product_id: number,
  buyItems: PromotionItemOffer[],
  getItems: PromotionItemOffer[],
  items: Pick<CartProduct, "id" | "quantity">[],
): number => {
  const promotionQuantities = getPromotionQuantities(buyItems, getItems, items);
  const productPromotion = promotionQuantities.find(
    (promo) => promo.id === product_id,
  );

  return productPromotion ? productPromotion.quantity : 0;
};

export const mergePromotionQuantities = (
  quantitiesList: {
    id: number;
    quantity: number;
    promotion_offer_id?: number;
  }[][],
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

export type MergedPromotionQuantity = {
  possibleQuantity: number;
  data: {
    id: number;
    label: string;
    price: number;
    serial: string;
    stock: {
      id: number;
      product_id: number;
      quantity: number;
      useAlert: boolean;
      alertCount: number;
      updatedAt: Date;
    } | null;
  };
  id: number;
  quantity: number;
  promotion_offer_id: number[];
};

export const getMergedPromotionQuantitiesFromOffers = (
  offers: ObtainPromotionOffer[],
  products: UseObtainPromotionOfferProps["products"],
): MergedPromotionQuantity[] => {
  if (offers.length === 0) return [];

  const allProductData = offers.flatMap((offer) =>
    offer.getItems.map((item) => item.product),
  );

  const quantifiedOffers = offers.map((offer) =>
    getPromotionQuantities(offer.buyItems, offer.getItems, products)
      .filter((item) => item.quantity > 0)
      .map((item) => ({
        id: item.id,
        quantity: item.quantity,
        promotion_offer_id: offer.id,
      })),
  );

  const merged = mergePromotionQuantities(quantifiedOffers).map((item) => {
    const data = allProductData.find((p) => p.id === item.id)!;
    const cartQuantity = products.find((q) => q.id == item.id)?.quantity || 0;
    const stockQuantity = data.stock?.quantity || 0;
    let possibleQuantity = item.quantity;

    if (cartQuantity + item.quantity > stockQuantity) {
      possibleQuantity = stockQuantity - cartQuantity;
    }

    return {
      ...item,
      possibleQuantity: possibleQuantity,
      data,
    };
  });

  return merged;
};
