"use client";
import { SearchProduct } from "@/actions/product/search";
import Scanner from "@/components/Scanner";
import ProductSelector from "@/components/Selector/ProductSelector";
import { useAppDispatch } from "@/hooks";
import {
  addProductToCartById,
  addProductToCartBySerial,
} from "@/reducers/cartReducer";
import { AddTwoTone } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";
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
        <Stack direction={"row"} spacing={1} mb={1}>
          <ProductSelector
            onSubmit={(product) => setSelectProduct(product || null)}
          />
          <Button
            variant={"contained"}
            color="secondary"
            sx={{
              width: 20,
            }}
            disabled={selectProduct == null}
            onClick={() =>
              selectProduct && dispatch(addProductToCartById(selectProduct.id))
            }
          >
            <AddTwoTone />
          </Button>
        </Stack>
        <CartSections />
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
