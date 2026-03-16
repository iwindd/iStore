import fetchObtainPromotionOffer from "@/actions/cashier/fetchObtainPromotionOffers";
import { getMergedPromotionQuantitiesFromOffers } from "@/libs/promotion";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useMemo } from "react";

export interface UseObtainPromotionOfferProps {
  products: {
    id: number;
    quantity: number;
  }[];
}

const useObtainPromotionOffer = ({
  products,
}: UseObtainPromotionOfferProps) => {
  const { store } = useParams<{ store: string }>();
  // Serialize the products array so the queryKey is stable by value, not by
  // object reference. Without this, a new array instance on every render would
  // cause React Query to refetch unnecessarily even when the cart hasn't changed.
  const productsKey = useMemo(() => JSON.stringify(products), [products]);
  const { data, isLoading } = useQuery({
    queryKey: ["obtainPromotionOffer", productsKey, store],
    queryFn: async () => {
      if (products.length === 0) return [];

      return await fetchObtainPromotionOffer(products, store);
    },
  });

  return {
    data: data,
    mergedPromotionQuantities: getMergedPromotionQuantitiesFromOffers(
      data || [],
      products,
    ),
    isLoading,
  };
};

export default useObtainPromotionOffer;
