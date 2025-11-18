import fetchObtainPromotionOffer from "@/actions/cashier/fetchObtainPromotionOffers";
import { getMergedPromotionQuantitiesFromOffers } from "@/libs/promotion";
import { useQuery } from "@tanstack/react-query";

export interface UseObtainPromotionOfferProps {
  products: {
    id: number;
    quantity: number;
  }[];
}

const useObtainPromotionOffer = ({
  products,
}: UseObtainPromotionOfferProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["obtainPromotionOffer", products],
    queryFn: async () => {
      if (products.length === 0) return [];

      return await fetchObtainPromotionOffer(products);
    },
  });

  return {
    data: data,
    mergedPromotionQuantities: getMergedPromotionQuantitiesFromOffers(
      data || [],
      products
    ),
    isLoading,
  };
};

export default useObtainPromotionOffer;
