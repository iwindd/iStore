"use client";
import getProductOrderData from "@/actions/product/getProductOrderData";
import { money } from "@/libs/formatter";
import { Skeleton, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useProduct } from "../../../ProductContext";

const TotalProfit = () => {
  const { product } = useProduct();

  const { data, isLoading } = useQuery({
    queryKey: ["product-order-data", product.id],
    queryFn: async () => await getProductOrderData(product.id),
  });

  return (
    <>
      <Typography variant="body2" color="text.secondary">
        กำไรทั้งหมด
      </Typography>

      {isLoading ? (
        <Skeleton variant="text" width={100} />
      ) : (
        <Typography variant="h6" color="success.main">
          {money(data?.totalProfit || 0)}
        </Typography>
      )}
    </>
  );
};

export default TotalProfit;
