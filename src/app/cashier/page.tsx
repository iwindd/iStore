"use client";
import { SearchProduct } from "@/actions/product/search";
import Scanner from "@/components/Scanner";
import ProductSelector from "@/components/Selector/ProductSelector";
import { useAppDispatch } from "@/hooks";
import {
  addProductToCartById,
  addProductToCartBySerial,
} from "@/reducers/cartReducer";
import { Button, Divider, Stack } from "@mui/material";
import Grid from "@mui/material/Grid";
import React from "react";
import CartSections from "./components/Cart";
import CashierTab from "./components/CashierTab";

const CashierPage = () => {
  const [selectProduct, setSelectProduct] =
    React.useState<SearchProduct | null>(null);
  const dispatch = useAppDispatch();

  return (
    <Grid container spacing={1} direction={"row-reverse"}>
      <Grid size={{ xs: 12, lg: 3 }}>
        <Stack direction={"row"} spacing={0.3}>
          <ProductSelector
            onSubmit={(product) => setSelectProduct(product || null)}
          />
          <Button
            variant={selectProduct == null ? "text" : "contained"}
            disabled={selectProduct == null}
            onClick={() =>
              selectProduct && dispatch(addProductToCartById(selectProduct.id))
            }
          >
            เพิ่ม
          </Button>
        </Stack>
        <Divider sx={{ my: 1 }} />
        <CartSections />
      </Grid>
      <Grid size={{ xs: 12, lg: 9 }}>
        <Scanner
          onSubmit={(serial) => {
            dispatch(addProductToCartBySerial(serial));
          }}
        />
        <Divider sx={{ my: 1 }} />
        <CashierTab />
      </Grid>
    </Grid>
  );
};

export default CashierPage;
