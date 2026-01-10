"use client";
import getProductOrderData from "@/actions/product/getSoldCount";
import { money } from "@/libs/formatter";
import { Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useProduct } from "../../../ProductContext";

const TotalProfit = () => {
  const { product } = useProduct();

  const productOrderData = useQuery({
    queryKey: ["product-order-data", product.id],
    queryFn: async () => await getProductOrderData(product.id),
  });

  if (!productOrderData.data) return null;

  const profit = productOrderData.data.reduce((acc, order) => {
    return acc + (order.price - order.cost) * order.count;
  }, 0);

  return (
    <>
      <Typography variant="body2" color="text.secondary">
        กำไรทั้งหมด
      </Typography>
      <Typography variant="h6" color="success.main">
        {money(profit || 0)}
      </Typography>
    </>
  );
};

export default TotalProfit;
