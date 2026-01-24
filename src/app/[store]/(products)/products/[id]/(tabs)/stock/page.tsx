"use client";

import { Card, CardContent, CardHeader, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import ProductStockAlertForm from "./components/ProductStockAlertForm";
import ProductUpdateStockForm from "./components/ProductUpdateStockForm";

const ProductStockPage = () => {
  const t = useTranslations("PRODUCT_DETAIL.stock");
  return (
    <Stack spacing={1}>
      <Card>
        <CardContent>
          <ProductStockAlertForm />
        </CardContent>
      </Card>
      <Card>
        <CardHeader title={t("manage_stock")} />
        <CardContent>
          <ProductUpdateStockForm />
        </CardContent>
      </Card>
    </Stack>
  );
};

export default ProductStockPage;
