"use client";
import adjustProductStock from "@/actions/product/adjustProductStock";
import { StorePermissionEnum } from "@/enums/permission";
import { usePermission } from "@/providers/PermissionProvider";
import {
  ProductAdjustStockSchema,
  ProductAdjustStockValues,
} from "@/schema/Product";
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveTwoTone } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useProduct } from "../../../ProductContext";

const ProductUpdateStockForm = () => {
  const t = useTranslations("PRODUCT_DETAIL.stock.update_form");
  const { product, updateProduct } = useProduct();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);
  const params = useParams<{ store: string }>();
  const permission = usePermission();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    reset,
  } = useForm<ProductAdjustStockValues>({
    resolver: zodResolver(ProductAdjustStockSchema),
    defaultValues: {
      stock: product.stock?.quantity || 0,
      note: "",
    },
  });

  const adjustStockMutation = useMutation({
    mutationFn: (payload: ProductAdjustStockValues) =>
      adjustProductStock(params.store, { ...payload, id: product.id }),
    onSettled: () => {
      setOpenDialog(false);
    },
    onSuccess: (data) => {
      enqueueSnackbar(t("success"), { variant: "success" });
      router.refresh();
      reset({
        stock: data.quantity_after,
        note: "",
      });
      updateProduct({
        stock: {
          ...product.stock,
          quantity: data.quantity_after,
        },
      });
    },
    onError: () => {
      enqueueSnackbar(t("error"), {
        variant: "error",
      });
    },
  });

  const onCancel = () => {
    setOpenDialog(false);
    reset();
  };

  const hasPermission = permission.hasStorePermission(
    StorePermissionEnum.PRODUCT_MANAGEMENT,
  );
  const disabled = adjustStockMutation.isPending || !hasPermission;

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setOpenDialog(true);
        }}
      >
        <Grid container spacing={2} maxWidth={"500px"}>
          <Grid>
            <TextField
              fullWidth
              label={t("stock_label")}
              type="number"
              {...register("stock", { valueAsNumber: true })}
              error={!!errors.stock}
              helperText={errors.stock?.message}
              disabled={disabled}
            />
          </Grid>
        </Grid>

        {isDirty && !disabled && (
          <Button
            startIcon={<SaveTwoTone />}
            type="submit"
            color="success"
            variant="contained"
            sx={{ mt: 2 }}
          >
            {t("save")}
          </Button>
        )}
      </form>

      {hasPermission && (
        <Dialog open={openDialog} onClose={onCancel} maxWidth="xs" fullWidth>
          <DialogTitle>{t("dialog.title")}</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
              {t("dialog.text", {
                label: product.label,
                count: watch("stock"),
              })}
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label={t("dialog.note")}
              fullWidth
              variant="standard"
              multiline
              rows={2}
              {...register("note")}
              error={!!errors.note}
              helperText={errors.note?.message}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onCancel}>{t("dialog.cancel")}</Button>
            <Button
              onClick={handleSubmit((data) => adjustStockMutation.mutate(data))}
              variant="contained"
              color="primary"
              disabled={adjustStockMutation.isPending}
              loading={adjustStockMutation.isPending}
            >
              {t("dialog.confirm")}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default ProductUpdateStockForm;
