"use client";
import ProductSelector from "@/components/Selector/ProductSelector";
import {
  AddProductDialogSchema,
  AddProductDialogValues,
} from "@/schema/Promotion/AddProductToOffer";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { useTranslations } from "next-intl";
import React from "react";
import { useForm } from "react-hook-form";

interface AddProductDialogProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit: (data: AddProductDialogValues) => void;
}

const AddProductDialog: React.FC<AddProductDialogProps> = ({
  open,
  title,
  onClose,
  onSubmit,
}) => {
  const t = useTranslations("PROMOTIONS.buyXgetY.add_product_dialog");
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<AddProductDialogValues>({
    resolver: zodResolver(AddProductDialogSchema),
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          component: "form",
          onSubmit: (e: React.FormEvent) => {
            void handleSubmit(onSubmit)(e);
          },
        },
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <ProductSelector
            error={errors["product_id"] !== undefined}
            helperText={errors["product_id"]?.message}
            onSubmit={(product) => {
              setValue("product_id", product?.id as number);
            }}
          />
          <TextField
            label={t("quantity")}
            type="number"
            error={errors.quantity != undefined}
            helperText={errors.quantity?.message}
            {...register("quantity", { valueAsNumber: true })}
            slotProps={{
              htmlInput: { min: 1 },
            }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("cancel")}</Button>
        <Button
          variant="contained"
          type="submit"
          color="success"
          endIcon={<ChevronRight />}
        >
          {t("submit")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProductDialog;
