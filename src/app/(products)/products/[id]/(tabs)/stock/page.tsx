"use client";

import { Card, CardContent, CardHeader, Stack } from "@mui/material";
import ProductStockAlertForm from "./components/ProductStockAlertForm";
import ProductUpdateStockForm from "./components/ProductUpdateStockForm";

const ProductStockPage = () => {
  return (
    <Stack spacing={1}>
      <Card>
        <CardContent>
          <ProductStockAlertForm />
        </CardContent>
      </Card>
      <Card>
        <CardHeader title="จัดการสต๊อก" />
        <CardContent>
          <ProductUpdateStockForm />
        </CardContent>
      </Card>
    </Stack>
  );
};

export default ProductStockPage;
