import fetchObtainPromotionOffer from "@/actions/cashier/fetchObtainPromotionOffers";
import { getMergedPromotionQuantitiesFromOffers } from "@/libs/promotion";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

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
  const { data, isLoading } = useQuery({
    queryKey: ["obtainPromotionOffer", products, store],
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
