import { getOldestOrder } from "@/actions/dashboard/getOldestOrder";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const useStoreOrderAge = () => {
  const params = useParams<{ store: string }>();
  const currentYear = dayjs().year();
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  const { data: oldestOrderDate, isLoading: isLoadingOldestOrder } = useQuery({
    queryKey: ["oldest-order", params.store],
    queryFn: () => getOldestOrder(params.store),
  });

  useEffect(() => {
    if (oldestOrderDate) {
      const oldestYear = dayjs(oldestOrderDate).year();
      const years: number[] = [];
      for (let year = currentYear; year >= oldestYear; year--) {
        years.push(year);
      }
      setAvailableYears(years);
    }
  }, [oldestOrderDate, currentYear]);

  return {
    isLoading: isLoadingOldestOrder,
    currentYear: currentYear,
    data: {
      years: availableYears,
    },
  };
};

export default useStoreOrderAge;
