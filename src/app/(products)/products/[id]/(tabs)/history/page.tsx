"use client";
import { Box, Card, CardContent, CardHeader, Typography } from "@mui/material";
import { useProduct } from "../../ProductContext";

const ProductHistoryPage = () => {
  const product = useProduct();

  return (
    <Box>
      <Card>
        <CardHeader
          title="ประวัติการสั่งซื้อ"
          subheader={`สินค้า: ${product.label}`}
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
