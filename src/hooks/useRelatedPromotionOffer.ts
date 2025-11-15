import fetchRelatedPromotionOffer from "@/actions/cashier/fetchRelatedPromotionOffers";
import { useQuery } from "@tanstack/react-query";

interface UseRelatedPromotionOfferProps {
  productIds: number[];
  hasProducts?: {
    id: number;
    quantity: number;
  };
}

const useRelatedPromotionOffer = ({
  productIds,
}: UseRelatedPromotionOfferProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["relatedPromotionOffers", productIds],
    queryFn: async () => {
      if (productIds.length === 0) return [];

      return await fetchRelatedPromotionOffer(productIds);
    },
  });

  return {
    data,
    isLoading,
  };
};

export default useRelatedPromotionOffer;
