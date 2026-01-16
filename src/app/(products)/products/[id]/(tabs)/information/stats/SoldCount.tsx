"use client";
import getProductOrderData from "@/actions/product/getProductOrderData";
import { Skeleton, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useProduct } from "../../../ProductContext";

const SoldCount = () => {
  const { product } = useProduct();

  const { data, isLoading } = useQuery({
    queryKey: ["product-order-data", product.id],
    queryFn: async () => await getProductOrderData(product.id),
  });

  return (
    <>
      <Typography variant="body2" color="text.secondary">
        ขายไปแล้ว
      </Typography>
      {isLoading ? (
        <Skeleton variant="text" width={100} />
      ) : (
        <Typography variant="h6">{`${data?.totalOrderCount || 0} รายการ`}</Typography>
      )}
    </>
  );
};

export default SoldCount;
