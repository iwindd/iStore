"use client";
import getMostSoldProducts from "@/actions/product/getMostSold";
import { SearchProduct } from "@/actions/product/search";
import Scanner from "@/components/Scanner";
import Selector from "@/components/Selector";
import { useAppDispatch } from "@/hooks";
import { Confirmation, useConfirm } from "@/hooks/use-confirm";
import usePayment from "@/hooks/use-payment";
import { addProductToCartById, clearProductCart } from "@/reducers/cartReducer";
import { DeleteTwoTone, PaymentTwoTone } from "@mui/icons-material";
import { Button, Chip, Divider, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { Product } from "@prisma/client";
import dynamic from "next/dynamic";
import React from "react";

const CartContainer = dynamic(() => import("./components/Cart"), {
  ssr: false,
});

const CashierPage = () => {
  const [selectProduct, setSelectProduct] =
    React.useState<SearchProduct | null>(null);
  const [mostSoldProducts, setMostSoldProducts] = React.useState<Product[]>([]);
  const [isFetching, setIsFetching] = React.useState(false);
  const dispatch = useAppDispatch();
  const payment = usePayment();

  const fetchMostSoldProducts = async () => {
    try {
      setIsFetching(true);
      const resp = await getMostSoldProducts();
      setMostSoldProducts(resp);
    } catch (error) {
      console.error("Failed to fetch most sold products:", error);
    }
  };

  React.useEffect(() => {
    if (mostSoldProducts.length === 0 && !isFetching) {
      fetchMostSoldProducts();
    }
  }, [mostSoldProducts, setMostSoldProducts, isFetching, setIsFetching]);

  const confirmation = useConfirm({
    title: "แจ้งเตือน",
    text: "คุณต้องการจะล้างตะกร้าหรือไม่? สินค้าภายในตะกร้าจะถูกลบและไม่สามารถย้อนกลับได้!",
    confirmProps: {
      color: "warning",
      startIcon: <DeleteTwoTone />,
    },
    confirm: "ล้างตะกร้า",
    onConfirm: async () => {
      dispatch(clearProductCart());
    },
  });

  return (
    <>
      <Grid container spacing={1} direction={"row-reverse"}>
        <Grid xs={12}>
          <Scanner
            onSubmit={(p) => {
              dispatch(addProductToCartById(p.id));
            }}
          />
        </Grid>
        <Grid xs={12} lg={3}>
          <Stack direction={"row"} spacing={0.3}>
            <Selector
              onSubmit={(product) => setSelectProduct(product || null)}
            />
            <Button
              variant={selectProduct == null ? "text" : "contained"}
              disabled={selectProduct == null}
              onClick={() =>
                selectProduct &&
                dispatch(addProductToCartById(selectProduct.id))
              }
            >
              เพิ่ม
            </Button>
          </Stack>
          <Divider sx={{ my: 1 }} />
          <Stack>
            <CartContainer />
          </Stack>
          <Divider sx={{ my: 1 }} />
          <Stack spacing={1} direction={"row"}>
            <Button
              variant="contained"
              color="success"
              startIcon={<PaymentTwoTone />}
              onClick={payment.toggle}
            >
              เช็คบิล
            </Button>
            <Button
              variant="contained"
              color="warning"
              startIcon={<DeleteTwoTone />}
              onClick={confirmation.handleOpen}
            >
              ล้างตะกร้า
            </Button>
          </Stack>
          <Confirmation {...confirmation.props} />
        </Grid>
        <Grid xs={12} lg={9}>
          <Typography variant="body1">สินค้าขายดี</Typography>
          <Grid container gap={1}>
            {mostSoldProducts.map((product) => (
              <Grid key={product.id}>
                <Chip
                  label={product.label}
                  component="button"
                  onClick={() => dispatch(addProductToCartById(product.id))}
                  clickable
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      {payment.dialog}
    </>
  );
};

export default CashierPage;
