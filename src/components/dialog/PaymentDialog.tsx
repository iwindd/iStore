import { useAppDispatch, useAppSelector } from "@/hooks";
import useFormValidate from "@/hooks/useFormValidate";
import { money } from "@/libs/formatter";
import { useInterface } from "@/providers/InterfaceProvider";
import { cashoutCart } from "@/reducers/cartReducer";
import { CashoutInputSchema, CashoutInputValues } from "@/schema/Payment";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShoppingCartCheckoutTwoTone } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Method } from "@prisma/client";
import React from "react";
import { SubmitHandler } from "react-hook-form";

interface PaymentDialogProps {
  open: boolean;
  onClose(): void;
}

const PaymentDialog = ({ open, onClose }: PaymentDialogProps) => {
  const total = useAppSelector((state) => state.cart.total);
  const { setBackdrop, isBackdrop } = useInterface();
  const [moneyLeft, setMoneyLeft] = React.useState<number>();
  const dispatch = useAppDispatch();

  const { register, handleSubmit, reset } = useFormValidate<CashoutInputValues>(
    {
      resolver: zodResolver(CashoutInputSchema),
      defaultValues: {
        method: Method.CASH,
        note: "",
      },
    }
  );

  const onSubmit: SubmitHandler<CashoutInputValues> = async (
    payload: CashoutInputValues
  ) => {
    setBackdrop(true);
    const resp = await dispatch(cashoutCart(payload));
    if (resp.meta.requestStatus == "fulfilled") reset();
    onClose();
    setBackdrop(false);
  };

  return (
    <Dialog
      open={open && !isBackdrop}
      onClose={onClose}
      fullWidth
      slotProps={{
        paper: {
          component: "form",
          onSubmit: handleSubmit(onSubmit),
        },
      }}
    >
      <DialogTitle>ชำระเงิน</DialogTitle>
      <DialogContent>
        <Stack spacing={1}>
          <Stack direction={"row"} justifyContent={"space-between"} mb={1}>
            <Typography variant="caption">ยอดสุทธิ</Typography>
            <Typography variant="caption">{money(total)}</Typography>
          </Stack>
          <TextField
            autoFocus
            fullWidth
            label="จำนวนเงิน"
            type="number"
            value={moneyLeft}
            onChange={(e) => setMoneyLeft(+e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">฿</InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    {money((moneyLeft || 0) - total)}฿
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            label="หมายเหตุ"
            type="text"
            fullWidth
            placeholder="เช่น ชื่อผู้ใช้ รหัสการสั่งจอง คำอธิบาย ข้อมูล คำชี้แจงเพิ่มเติม หรือ อื่นๆ"
            {...register("note")}
          />
          <FormControl fullWidth>
            <InputLabel id="payment">ช่องทางการชำระเงิน</InputLabel>
            <Select
              labelId="payment"
              label="ช่องทางการชำระเงิน"
              {...register("method")}
              defaultValue={Method.CASH}
            >
              <MenuItem value={Method.CASH}>เงินสด</MenuItem>
              <MenuItem value={Method.BANK}>ธนาคาร</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" type="button" onClick={onClose}>
          ยกเลิก
        </Button>
        <Button
          variant="contained"
          color="success"
          startIcon={<ShoppingCartCheckoutTwoTone />}
          autoFocus
          type="submit"
        >
          ตกลง
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentDialog;
