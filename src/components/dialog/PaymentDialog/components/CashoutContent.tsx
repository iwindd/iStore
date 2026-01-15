import { useAppDispatch, useAppSelector } from "@/hooks";
import { money } from "@/libs/formatter";
import { useInterface } from "@/providers/InterfaceProvider";
import { cashoutCart } from "@/reducers/cartReducer";
import { CashoutInputSchema, CashoutInputValues } from "@/schema/Payment";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowForward,
  Close,
  Notes,
  PaymentsTwoTone,
  QrCodeTwoTone,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { Method } from "@prisma/client";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { PaymentDialogProps } from "..";

const MethodButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "active",
})<{ active?: boolean }>(({ theme, active }) => ({
  flex: 1,
  height: 90,
  borderRadius: 16,
  flexDirection: "column",
  gap: 4,
  border: `2px solid ${active ? theme.palette.primary.main : theme.palette.divider}`,
  backgroundColor: active ? theme.palette.action.hover : "transparent",
  color: active ? theme.palette.primary.main : theme.palette.text.secondary,
  "&:hover": {
    border: `2px solid ${theme.palette.primary.main}`,
    backgroundColor: theme.palette.action.hover,
  },
  "& .MuiSvgIcon-root": {
    fontSize: 32,
  },
}));

const BanknoteCard = styled(Box)<{ unit: number }>(({ unit }) => {
  const colors: Record<number, { bg: string; text: string }> = {
    1000: { bg: "#f3e5f5", text: "#7b1fa2" }, // Example, image doesn't show 1000
    500: { bg: "#f3e5f5", text: "#7b1fa2" }, // Purple
    100: { bg: "#ffebee", text: "#c62828" }, // Red
    50: { bg: "#e3f2fd", text: "#1565c0" }, // Blue
    20: { bg: "#e8f5e9", text: "#2e7d32" }, // Green
    10: { bg: "#fff3e0", text: "#ef6c00" }, // Orange/Brown
  };

  const style = colors[unit] || { bg: "#f5f5f5", text: "#616161" };

  return {
    display: "flex",
    alignItems: "center",
    padding: "8px 16px",
    borderRadius: 12,
    backgroundColor: style.bg,
    color: style.text,
    gap: 12,
    marginBottom: 8,
    border: `1px solid ${style.text}20`,
    boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
  };
});

const calculateBreakdown = (amount: number) => {
  const units = [1000, 500, 100, 50, 20, 10, 5, 2, 1];
  const breakdown: { unit: number; count: number }[] = [];
  let remaining = amount;

  for (const unit of units) {
    if (remaining >= unit) {
      const count = Math.floor(remaining / unit);
      breakdown.push({ unit, count });
      remaining %= unit;
    }
  }
  return breakdown;
};

const CashoutContent = ({ open, onClose }: PaymentDialogProps) => {
  const total = useAppSelector((state) => state.cart.total);
  const { setBackdrop, isBackdrop } = useInterface();
  const [moneyReceived, setMoneyReceived] = React.useState<number>(0);
  const dispatch = useAppDispatch();

  const { register, handleSubmit, reset, setValue, watch } =
    useForm<CashoutInputValues>({
      resolver: zodResolver(CashoutInputSchema),
      defaultValues: {
        method: Method.CASH,
        note: "",
      },
    });

  const selectedMethod = watch("method");

  const onSubmit = async (payload: CashoutInputValues) => {
    setBackdrop(true);
    const resp = await dispatch(cashoutCart(payload));
    if (resp.meta.requestStatus == "fulfilled") {
      reset();
      setMoneyReceived(0);
      onClose();
    }
    setBackdrop(false);
  };

  const quickPicks = useMemo(() => {
    const targets = [10, 20, 50, 100, 500, 1000];
    const picks = new Set<number>([total]);

    targets.forEach((target) => {
      const next = Math.ceil((total + 1) / target) * target;
      if (next > total) {
        picks.add(next);
      }
    });

    return Array.from(picks)
      .sort((a, b) => a - b)
      .slice(0, 5);
  }, [total]);

  const changeDue = Math.max(0, moneyReceived - total);
  const breakdown = useMemo(() => calculateBreakdown(changeDue), [changeDue]);

  return (
    <Dialog
      open={open && !isBackdrop}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
    >
      <Grid container sx={{ minHeight: 600 }}>
        {/* Left Column: Input */}
        <Grid
          size={{ xs: 12, md: 7.5 }}
          sx={{ p: 4, bgcolor: "background.paper" }}
        >
          <Stack spacing={2}>
            <Box>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                ชำระเงิน
              </Typography>
            </Box>

            <Stack direction="row" spacing={2}>
              <MethodButton
                active={selectedMethod === Method.CASH}
                onClick={() => setValue("method", Method.CASH)}
              >
                <Box sx={{ position: "relative" }}>
                  <PaymentsTwoTone />
                </Box>
                <Typography variant="body2" fontWeight={600}>
                  เงินสด
                </Typography>
              </MethodButton>
              <MethodButton
                active={selectedMethod === Method.BANK}
                onClick={() => setValue("method", Method.BANK)}
              >
                <Box sx={{ position: "relative" }}>
                  <QrCodeTwoTone />
                </Box>
                <Typography variant="body2" fontWeight={600}>
                  โอนเงิน
                </Typography>
              </MethodButton>
            </Stack>

            <Box>
              <Typography
                variant="caption"
                fontWeight={700}
                color="text.secondary"
                sx={{ mb: 1, display: "block", textTransform: "uppercase" }}
              >
                จำนวนเงินที่ได้รับ
              </Typography>
              <TextField
                fullWidth
                value={moneyReceived || ""}
                onChange={(e) => setMoneyReceived(Number(e.target.value))}
                placeholder="0.00"
                autoFocus
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography
                          variant="h4"
                          color="text.secondary"
                          sx={{ mr: 1 }}
                        >
                          ฿
                        </Typography>
                      </InputAdornment>
                    ),
                    endAdornment: moneyReceived > 0 && (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setMoneyReceived(0)}
                          size="small"
                        >
                          <Close />
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: {
                      fontSize: "2.5rem",
                      fontWeight: 700,
                      px: 2,
                      py: 1,
                      borderRadius: 4,
                      "& .MuiInputBase-input": {
                        py: 1,
                      },
                    },
                  },
                }}
              />
            </Box>

            <Stack direction="row" spacing={1.5}>
              {quickPicks.map((pick) => (
                <Button
                  key={pick}
                  variant={moneyReceived === pick ? "contained" : "outlined"}
                  onClick={() => setMoneyReceived(pick)}
                  sx={{
                    px: 2,
                    py: 1,
                    textTransform: "none",
                    minWidth: 100,
                  }}
                >
                  <Typography variant="body2" fontWeight={600}>
                    {pick === total ? `ราคาพอดี (${money(pick)})` : money(pick)}
                  </Typography>
                </Button>
              ))}
            </Stack>

            <Box>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <Notes sx={{ fontSize: 18, color: "text.secondary" }} />
                <Typography
                  variant="caption"
                  fontWeight={700}
                  color="text.secondary"
                  sx={{ textTransform: "uppercase" }}
                >
                  หมายเหตุ
                </Typography>
              </Stack>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="เช่น ชื่อผู้ใช้ รหัสการสั่งจอง คำอธิบาย ข้อมูล คำชี้แจงเพิ่มเติม หรือ อื่นๆ"
                {...register("note")}
              />
            </Box>
          </Stack>
        </Grid>

        {/* Right Column: Summary */}
        <Grid
          size={{ xs: 12, md: 4.5 }}
          sx={{
            p: 4,
            bgcolor: "rgba(0,0,0,0.02)",
            borderLeft: "1px solid",
            borderColor: "divider",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              p: 3,
              borderRadius: 1,
              bgcolor: "background.paper",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              mb: 4,
            }}
          >
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">ยอดสุทธิ</Typography>
                <Typography variant="h6" fontWeight={700}>
                  {money(total)}
                </Typography>
              </Stack>
              <Divider />
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">
                  จำนวนเงินที่ได้รับ
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {money(moneyReceived)}
                </Typography>
              </Stack>
            </Stack>
          </Box>

          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="caption"
              fontWeight={700}
              color="primary"
              sx={{ textTransform: "uppercase", letterSpacing: 1.5 }}
            >
              จำนวนเงินทอน
            </Typography>
            <Typography
              variant="h2"
              fontWeight={800}
              sx={{
                color: changeDue > 0 ? "secondary.main" : "text.disabled",
                my: 1,
              }}
            >
              <Typography component="span" variant="h4" sx={{ mr: 1 }}>
                ฿
              </Typography>
              {changeDue.toLocaleString()}
            </Typography>
          </Box>

          {changeDue > 0 && (
            <Box sx={{ flexGrow: 1, overflow: "auto" }}>
              <Typography
                variant="caption"
                fontWeight={700}
                color="text.secondary"
                sx={{
                  display: "block",
                  mb: 2,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                เงินทอน
              </Typography>
              {breakdown.map((item) => (
                <BanknoteCard key={item.unit} unit={item.unit}>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{ minWidth: 40 }}
                  >
                    {item.count}x
                  </Typography>
                  <Divider orientation="vertical" flexItem />
                  <Typography
                    variant="subtitle1"
                    fontWeight={800}
                    sx={{ flexGrow: 1 }}
                  >
                    ฿{item.unit}
                  </Typography>
                  <Typography
                    variant="caption"
                    fontWeight={700}
                    sx={{ opacity: 0.6 }}
                  >
                    {item.unit >= 20 ? "ธนบัตร" : "เหรียญ"}
                  </Typography>
                </BanknoteCard>
              ))}
            </Box>
          )}

          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={moneyReceived < total}
            onClick={handleSubmit(onSubmit)}
            endIcon={<ArrowForward />}
            sx={{
              height: 64,
              fontSize: "1.1rem",
              fontWeight: 700,
              textTransform: "none",
              mt: "auto",
            }}
          >
            ยืนยันการชำระเงิน
          </Button>
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default CashoutContent;
