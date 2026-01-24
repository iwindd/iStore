"use client";
import { Box, Card, CardContent, CardHeader, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useProduct } from "../../ProductContext";

const ProductHistoryPage = () => {
  const t = useTranslations("PRODUCT_DETAIL.history");
  const { product } = useProduct();

  return (
    <Box>
      <Card>
        <CardHeader
          title={t("title")}
          subheader={t("subheader", { label: product.label })}
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            ...
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProductHistoryPage;
