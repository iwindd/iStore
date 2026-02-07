"use client";
import { money } from "@/libs/formatter";
import { useInterface } from "@/providers/InterfaceProvider";
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
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { PaymentDialogContentProps } from "..";

const ConsignmentContent = ({
  open,
  onClose,
  total,
  onSubmit,
}: PaymentDialogContentProps) => {
  const t = useTranslations("CASHIER.consignment_dialog");
  const { isBackdrop } = useInterface();
  const form = useForm<ConsignmentInputValues>({
    resolver: zodResolver(ConsignmentInputSchema),
    defaultValues: {
      note: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

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
                {t("title")}
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
                  {t("note_label")}
                </Typography>
              </Stack>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder={t("note_placeholder")}
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
                <Typography color="text.secondary">{t("total")}</Typography>
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
            onClick={handleSubmit((data) => onSubmit(data, form))}
            endIcon={<ArrowForward />}
            sx={{
              height: 64,
              fontSize: "1.1rem",
              fontWeight: 700,
              textTransform: "none",
              mt: "auto",
            }}
          >
            {t("submit")}
          </Button>
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default ConsignmentContent;
