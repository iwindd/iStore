"use client";
import Scanner from "@/components/Scanner";
import { useAppDispatch } from "@/hooks";
import { addProductToCartBySerial } from "@/reducers/cartReducer";
import { Card, CardContent, CardHeader } from "@mui/material";
import Grid from "@mui/material/Grid";
import CartSections from "./components/Cart";
import CashierTab from "./components/CashierTab";

const CashierPage = () => {
  const dispatch = useAppDispatch();

  return (
    <Grid container spacing={1} direction={"row-reverse"}>
      <Grid size={{ xs: 12, lg: 3 }}>
        <Card sx={{ height: "800px" }}>
          <CardHeader title="ตะกร้าสินค้า" />
          <CardContent sx={{ height: "100%" }}>
            <CartSections />
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, lg: 9 }}>
        <Scanner
          onSubmit={(serial) => {
            dispatch(addProductToCartBySerial(serial));
          }}
        />
        <CashierTab />
      </Grid>
    </Grid>
  );
};

export default CashierPage;
