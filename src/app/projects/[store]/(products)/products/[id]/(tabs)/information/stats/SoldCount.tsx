"use client";
import getProductOrderData from "@/actions/product/getProductOrderData";
import { Skeleton, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useProduct } from "../../../ProductContext";

const SoldCount = () => {
  const t = useTranslations("PRODUCT_DETAIL.information.stats");
  const { product } = useProduct();

  const { data, isLoading } = useQuery({
    queryKey: ["product-order-data", product.id],
    queryFn: async () => await getProductOrderData(product.id),
  });

  return (
    <>
      <Typography variant="body2" color="text.secondary">
        {t("sold_count")}
      </Typography>
      {isLoading ? (
        <Skeleton variant="text" width={100} />
      ) : (
        <Typography variant="h6">
          {t("items_unit", { count: data?.totalOrderCount || 0 })}
        </Typography>
      )}
    </>
  );
};

export default SoldCount;
