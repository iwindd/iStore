"use client";
import { Card, CardContent, CardHeader, Grid, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { useProduct } from "../../ProductContext";
import ProductPreorderForm from "./components/ProductPreorderForm";
import ProductUpdateForm from "./components/ProductUpdateForm";
import SoldCount from "./stats/SoldCount";
import TotalProfit from "./stats/TotalProfit";

const ProductInformationPage = () => {
  const { product } = useProduct();
  const t = useTranslations("PRODUCT_DETAIL.information.header");

  return (
    <Stack spacing={1}>
      <Card>
        <CardHeader
          title={product.label}
          subheader={t("serial", { serial: product.serial })}
        />
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ lg: 2, md: 4, sm: 4, xs: 6 }}>
              <SoldCount />
            </Grid>
            <Grid size={{ lg: 2, md: 4, sm: 4, xs: 6 }}>
              <TotalProfit />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <ProductUpdateForm />
      <ProductPreorderForm />
    </Stack>
  );
};

export default ProductInformationPage;
