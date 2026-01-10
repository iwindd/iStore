"use client";
import getProductOrderData from "@/actions/product/getSoldCount";
import { Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useProduct } from "../../../ProductContext";

const SoldCount = () => {
  const product = useProduct();

  const productOrderData = useQuery({
    queryKey: ["product-order-data", product.id],
    queryFn: async () => await getProductOrderData(product.id),
  });

  return (
    <>
      <Typography variant="body2" color="text.secondary">
        ขายไปแล้ว
      </Typography>
      <Typography variant="h6">
        {productOrderData.data?.length || 0} รายการ
      </Typography>
    </>
  );
};

export default SoldCount;
