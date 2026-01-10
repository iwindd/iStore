"use client";
import { Box, Card, CardContent, CardHeader } from "@mui/material";
import { useProduct } from "../../ProductContext";

const ProductInformationPage = () => {
  const product = useProduct();

  return (
    <Box>
      <Card>
        <CardHeader
          title={product.label}
          subheader={`รหัสสินค้า: ${product.serial}`}
        />
        <CardContent>...</CardContent>
      </Card>
    </Box>
  );
};

export default ProductInformationPage;
