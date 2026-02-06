import fetchRelatedPromotionOffer from "@/actions/cashier/fetchRelatedPromotionOffers";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

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
  const { store } = useParams<{ store: string }>();
  const { data, isLoading } = useQuery({
    queryKey: ["relatedPromotionOffers", productIds, store],
    queryFn: async () => {
      return await fetchRelatedPromotionOffer(productIds, store);
    },
  });

  return {
    data,
    isLoading,
  };
};

export default useRelatedPromotionOffer;
