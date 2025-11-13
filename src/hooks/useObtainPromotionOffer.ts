import fetchObtainPromotionOffer from "@/actions/cashier/fetchObtainPromotionOffers";
import { useQuery } from "@tanstack/react-query";

interface UseObtainPromotionOfferProps {
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
    queryFn: async () => await fetchObtainPromotionOffer(products),
  });

  return {
    data,
    isLoading,
  };
};

export default useObtainPromotionOffer;
