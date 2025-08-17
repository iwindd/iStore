"use client";
import { PaymentSchema, PaymentValues } from "@/schema/Payment";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { KeyboardEvent, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useCart } from "./use-cart";
import { money } from "@/libs/formatter";
import { enqueueSnackbar } from "notistack";
import Cashout from "@/actions/cashier/cashout";
import { useInterface } from "@/providers/InterfaceProvider";
import { ShoppingCartCheckoutTwoTone } from "@mui/icons-material";
const Keys = ["Space", "valAltLeft", "valNumpadEnter"];

interface PaymentDialogProps {
  open: boolean;
  onClose(): void;
}

const PaymentDialog = ({ open, onClose }: PaymentDialogProps) => {
  const { cart, total, clear } = useCart();
  const { setBackdrop, isBackdrop } = useInterface();
  const [receipt, setReceipt] = React.useState<boolean>(false);
  const [moneyLeft, setMoneyLeft] = React.useState<number>();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PaymentValues>({
    resolver: zodResolver(PaymentSchema),
    defaultValues: {
      cart: cart,
      method: "cash",
    },
  });

  useEffect(() => {
    setValue("cart", cart);
  }, [cart, setValue]);

  const onSubmit: SubmitHandler<PaymentValues> = async (
    payload: PaymentValues
  ) => {
    setBackdrop(true);
    try {
      const resp = await Cashout({ ...payload, cart: cart });
      if (!resp.success) throw Error(resp.message);

      onClose();
      clear();
      reset();
      enqueueSnackbar("ทำรายการคิดเงินสำเร็จแล้ว!", {
        variant: "success",
      });
    } catch (error) {
      onClose();
      enqueueSnackbar("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้งภายหลัง", {
        variant: "error",
      });
    } finally {
      setBackdrop(false);
    }
  };

  return (
    <Dialog
      open={open && !isBackdrop}
      onClose={onClose}
      fullWidth
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit(onSubmit),
      }}
    >
      <DialogTitle>ชำระเงิน</DialogTitle>
      <DialogContent>
        <Stack spacing={1}>
          <Stack direction={"row"} justifyContent={"space-between"} mb={1}>
            <Typography variant="caption">ยอดสุทธิ</Typography>
            <Typography variant="caption">{money(total())}</Typography>
          </Stack>
          <TextField
            autoFocus
            fullWidth
            label="จำนวนเงิน"
            type="number"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">฿</InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {money((moneyLeft || 0) - total())}฿
                </InputAdornment>
              ),
            }}
            value={moneyLeft}
            onChange={(e) => setMoneyLeft(+e.target.value)}
          />
          <TextField
            label="หมายเหตุ"
            type="text"
            fullWidth
            placeholder="เช่น ชื่อผู้ใช้ รหัสการสั่งจอง คำอธิบาย ข้อมูล คำชี้แจงเพิ่มเติม หรือ อื่นๆ"
            error={!!errors["note"]?.message}
            helperText={errors["note"]?.message}
            {...register("note")}
          />
          <FormControl fullWidth>
            <InputLabel id="payment">ช่องทางการชำระเงิน</InputLabel>
            <Select
              labelId="payment"
              label="ช่องทางการชำระเงิน"
              value={watch("method")}
              {...register("method")}
            >
              <MenuItem value={"cash"}>เงินสด</MenuItem>
              <MenuItem value={"bank"}>ธนาคาร</MenuItem>
            </Select>
          </FormControl>
        {/*      TODO:: Instant Download
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  value={receipt}
                  onChange={(e) => setReceipt(e.target.checked)}
                />
              }
              label="ฉันต้องการใบเสร็จ"
            />
          </FormGroup>
           */}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" type="button" onClick={onClose}>
          ยกเลิก
        </Button>
        <Button variant="contained" color="success" startIcon={<ShoppingCartCheckoutTwoTone/>} autoFocus type="submit">ตกลง</Button>
      </DialogActions>
    </Dialog>
  );
};

interface PaymentHook {
  IsOpen: boolean;
  Dialog: React.ReactNode;
  toggle(): void;
}

const usePayment = (): PaymentHook => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const { total, clear, cart } = useCart();
  const {setBackdrop} = useInterface();

  const onClose = React.useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const toggle = React.useCallback((noAlert?: boolean) => {
    if (cart.length <= 0) {
      if (isOpen) setIsOpen(false);
      if (!noAlert) enqueueSnackbar("ไม่สามารถคิดเงินได้เนื่องจากไม่พบสินค้าในตะกร้าสินค้า", {
        variant: "error",
      });
      return;
    }

    setIsOpen(!isOpen);
  }, [isOpen, setIsOpen, cart]);

  const clearCart = React.useCallback(() => clear(), [clear])

  const onCashout = React.useCallback(async (method: "cash" | "bank") => {
    setBackdrop(true);
    try {
      const resp = await Cashout({ 
        method: method,
        note: "",
        cart: cart,
      });
      if (!resp.success) throw Error(resp.message);

      onClose();
      clear();
      enqueueSnackbar("ทำรายการคิดเงินสำเร็จแล้ว!", {
        variant: "success",
      });
    } catch (error) {
      onClose();
      enqueueSnackbar("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้งภายหลัง", {
        variant: "error",
      });
    } finally {
      setBackdrop(false);
    }
  }, [setBackdrop, onClose, clear, cart])

  const onKeydown = React.useCallback((key: KeyboardEvent) => {
    const action = () => {
      if (Keys.includes(key.code)) return toggle(true);
      if (key.code == "Delete" || key.code == "valNumpadDecimal0") return clearCart();
      if (key.code == "Numpad1") return onCashout("cash");
      if (key.code == "Numpad2") return onCashout("bank"); 
      return null
    }

    const state = action();
    if (state) key.preventDefault();
  }, [toggle, clearCart, onCashout]);

  useEffect(() => {
    const handleKeydown = (event: Event) =>
      onKeydown(event as unknown as KeyboardEvent);

    document.addEventListener("keydown", handleKeydown, false);

    return () => {
      document.removeEventListener("keydown", handleKeydown, false);
    };
  }, [onKeydown]);

  return {
    IsOpen: isOpen,
    Dialog: <PaymentDialog open={isOpen} onClose={onClose} />,
    toggle: toggle,
  };
};

export default usePayment;
