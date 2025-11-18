import fetchObtainPromotionOffer, {
  ObtainPromotionOffer,
} from "@/actions/cashier/fetchObtainPromotionOffers";
import {
  getPromotionQuantities,
  mergePromotionQuantities,
} from "@/libs/promotion";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface UseObtainPromotionOfferProps {
  products: {
    id: number;
    quantity: number;
  }[];
}

const useObtainPromotionOffer = ({
  products,
}: UseObtainPromotionOfferProps) => {
  const [obtainPromotionOffers, setObtainPromotionOffers] = useState<
    ObtainPromotionOffer[]
  >([]);
  const [mergedPromotionQuantities, setMergedPromotionQuantities] = useState<
    {
      promotion_offer_id: number[];
      id: number;
      quantity: number;
      possibleQuantity: number;
      data: ObtainPromotionOffer["getItems"][0]["product"];
    }[]
  >([]);

  const { data, isLoading } = useQuery({
    queryKey: ["obtainPromotionOffer", products],
    queryFn: async () => {
      if (products.length === 0) return [];

      return await fetchObtainPromotionOffer(products);
    },
  });

  useEffect(() => {
    if (data && !isLoading) {
      setObtainPromotionOffers(data);
      const allProductData = data.flatMap((offer) =>
        offer.getItems.map((item) => item.product)
      );

      const quantifiedOffers = data.map((offer) =>
        getPromotionQuantities(offer.buyItems, offer.getItems, products)
          .filter((item) => item.quantity > 0)
          .map((item) => ({
            id: item.id,
            quantity: item.quantity,
            promotion_offer_id: offer.id,
          }))
      );

      const merged = mergePromotionQuantities(quantifiedOffers).map((item) => {
        const data = allProductData.find((p) => p.id === item.id)!;
        const cartQuantity =
          products.find((q) => q.id == item.id)?.quantity || 0;
        const canOverstock = data.category?.overstock;
        let possibleQuantity = item.quantity;

        if (cartQuantity + item.quantity > data.stock && !canOverstock) {
          possibleQuantity = data.stock - cartQuantity;
        }

        return {
          ...item,
          possibleQuantity: possibleQuantity,
          data,
        };
      });

      setMergedPromotionQuantities(merged);
    }
  }, [data, isLoading, products]);

  return {
    data: obtainPromotionOffers,
    mergedPromotionQuantities,
    isLoading,
  };
};

export default useObtainPromotionOffer;
