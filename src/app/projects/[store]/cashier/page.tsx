"use client";
import Scanner from "@/components/Scanner";
import { useAppDispatch } from "@/hooks";
import App, { Wrapper } from "@/layouts/App";
import { addProductToCartBySerial } from "@/reducers/cartReducer";
import { Card, CardContent, CardHeader } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useTranslations } from "next-intl";
import CartSections from "./components/Cart";
import CashierTab from "./components/CashierTab";

const CashierPage = () => {
  const t = useTranslations("CASHIER");
  const dispatch = useAppDispatch();

  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title>{t("title")}</App.Header.Title>
      </App.Header>
      <App.Main>
        <Grid container spacing={1} direction={"row-reverse"}>
          <Grid size={{ xs: 12, lg: 3 }}>
            <Card
              sx={{
                height: {
                  sm: "auto",
                  md: "700px",
                },
              }}
            >
              <CardHeader title={t("cart.title")} />
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
      </App.Main>
    </Wrapper>
  );
};

export default CashierPage;
