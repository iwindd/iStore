import { useAppDispatch, useAppSelector } from "@/hooks";
import { money } from "@/libs/formatter";
import { useInterface } from "@/providers/InterfaceProvider";
import { consignmentCart } from "@/reducers/cartReducer";
import {
  ConsignmentInputSchema,
  ConsignmentInputValues,
} from "@/schema/Payment";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowForward, Notes } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { PaymentDialogProps } from "..";

const ConsignmentContent = ({ open, onClose }: PaymentDialogProps) => {
  const total = useAppSelector((state) => state.cart.total);
  const { setBackdrop, isBackdrop } = useInterface();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ConsignmentInputValues>({
    resolver: zodResolver(ConsignmentInputSchema),
    defaultValues: {
      note: "",
    },
  });

  const onSubmit = async (data: ConsignmentInputValues) => {
    setBackdrop(true);
    const resp = await dispatch(consignmentCart(data));
    if (resp.meta.requestStatus == "fulfilled") {
      reset();
      onClose();
    }
    setBackdrop(false);
  };

  return (
    <Dialog
      open={open && !isBackdrop}
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >
      <Grid container sx={{ minHeight: 200 }}>
        {/* Left Column: Input */}
        <Grid
          size={{ xs: 12, md: 7.5 }}
          sx={{ p: 4, bgcolor: "background.paper" }}
        >
          <Stack spacing={2}>
            <Box>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                ฝากขาย
              </Typography>
            </Box>

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
                error={!!errors.note}
                helperText={errors.note?.message}
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
            </Stack>
          </Box>

          <Button
            variant="contained"
            color="warning"
            fullWidth
            size="large"
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
            ยืนยันการฝากขาย
          </Button>
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default ConsignmentContent;
