"use client";
import React from "react";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import Cashier from "./components/Cashier";
import { Confirmation, useConfirm } from "@/hooks/use-confirm";
import { Button, Divider, Stack } from "@mui/material";
import dynamic from "next/dynamic";
import { DeleteTwoTone, PaymentTwoTone } from "@mui/icons-material";
import { CartProduct, useCart } from "@/hooks/use-cart";
import usePayment from "@/hooks/use-payment";
import Selector from "@/components/Selector";
import { Product } from "@prisma/client";
import { useInterface } from "@/providers/InterfaceProvider";
import GetProduct from "@/actions/product/find";
import { enqueueSnackbar } from "notistack";

const CartContainer = dynamic(() => import("./components/Cart"), {
  ssr: false,
});

const CashierPage = () => {
  const { clear, addProduct } = useCart();
  const { Dialog, toggle } = usePayment();
  const [selectProduct, setSelectProduct] = React.useState<Product | null>(null);
  const { setBackdrop } = useInterface();

  const confirmation = useConfirm({
    title: "แจ้งเตือน",
    text: "คุณต้องการจะล้างตะกร้าหรือไม่? สินค้าภายในตะกร้าจะถูกลบและไม่สามารถย้อนกลับได้!",
    confirmProps:{
      color: "warning",
      startIcon: <DeleteTwoTone />,
    },
    confirm: "ล้างตะกร้า",
    onConfirm: async () => clear(),
  });

  const onSubmit = (Product: Product | null) => {
    setSelectProduct(Product)
  }

  const onAddBySelector = async () => {
    if (!selectProduct) return;
    try {
      setBackdrop(true);
      const resp = await GetProduct(selectProduct.serial);
      if (!resp.success && resp.data) throw Error("not_found");
      addProduct(resp.data as CartProduct);
      enqueueSnackbar(`เพิ่มสินค้า <${resp.data?.label}> เข้าตะกร้าแล้ว!`, {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar(typeof(error) == "string" ? error : `ไม่พบสินค้า ${selectProduct.label} ในระบบ!`, { variant: "error" });
    } finally{
      setBackdrop(false)
    }
  }

  return (
    <>
      <Grid container spacing={1} direction={"row-reverse"}>
        <Grid xs={12}>
          <Cashier />
        </Grid>
        <Grid xs={12} lg={3}>
          <Stack direction={"row"} spacing={0.3}>
            <Selector onSubmit={onSubmit} />
            <Button
              variant={selectProduct == null ? "text": "contained"}
              disabled={selectProduct == null}
              onClick={onAddBySelector}
            >เพิ่ม</Button>
          </Stack>
          <Divider sx={{my: 1}} />
          <Stack>
            <CartContainer />
          </Stack>
          <Divider sx={{my: 1}} />
          <Stack spacing={1} direction={"row"}>
            <Button
              variant="contained"
              color="success"
              startIcon={<PaymentTwoTone />}
              onClick={() => toggle()}
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
          {/* TODO: Most ordered list */}
        </Grid>
      </Grid>

      {Dialog}
    </>
  );
};

export default CashierPage;
