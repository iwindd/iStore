"use client";
import { Card, CardContent, CardHeader, Stack } from "@mui/material";
import { useProduct } from "../../ProductContext";
import ProductUpdateForm from "./components/ProductUpdateForm";

const ProductInformationPage = () => {
  const product = useProduct();

  return (
    <Stack spacing={1}>
      <Card>
        <CardHeader
          title={product.label}
          subheader={`รหัสสินค้า: ${product.serial}`}
        />
        <CardContent>...</CardContent>
      </Card>
      <ProductUpdateForm />
    </Stack>
  );
};

export default ProductInformationPage;
