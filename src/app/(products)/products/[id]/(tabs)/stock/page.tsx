"use client";

import { Card, CardContent, CardHeader, Stack } from "@mui/material";
import ProductUpdateStockForm from "./components/ProductUpdateStockForm";

const ProductStockPage = () => {
  return (
    <Stack>
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
