"use client";
import { SearchProduct } from "@/actions/product/search";
import Scanner from "@/components/Scanner";
import Selector from "@/components/Selector";
import { useAppDispatch } from "@/hooks";
import { Confirmation, useConfirm } from "@/hooks/use-confirm";
import usePayment from "@/hooks/use-payment";
import { addProductToCartById, clearProductCart } from "@/reducers/cartReducer";
import { DeleteTwoTone, PaymentTwoTone } from "@mui/icons-material";
import { Button, Divider, Stack } from "@mui/material";
import Grid from "@mui/material/Grid";
import React from "react";
import CartContainer from "./components/Cart";
import CashierTab from "./components/CashierTab";

const CashierPage = () => {
  const [selectProduct, setSelectProduct] =
    React.useState<SearchProduct | null>(null);
  const dispatch = useAppDispatch();
  const payment = usePayment();

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
        <Grid size={12}>
          <Scanner
            onSubmit={(p) => {
              dispatch(addProductToCartById(p.id));
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 3 }}>
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
        <Grid size={{ xs: 12, lg: 9 }}>
          <CashierTab />
        </Grid>
      </Grid>

      {payment.dialog}
    </>
  );
};

export default CashierPage;
