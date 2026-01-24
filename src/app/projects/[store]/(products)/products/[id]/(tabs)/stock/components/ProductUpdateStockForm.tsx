"use client";
import UpdateStock from "@/actions/product/updateStock";
import {
  ProductUpdateStockSchema,
  ProductUpdateStockValues,
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
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
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
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    reset,
    getValues,
  } = useForm<ProductUpdateStockValues>({
    resolver: zodResolver(ProductUpdateStockSchema),
    defaultValues: {
      stock: product.stock?.quantity || 0,
      note: "",
    },
  });

  const onSubmit = async (data: ProductUpdateStockValues) => {
    setLoading(true);
    try {
      const resp = await UpdateStock(data, product.id);
      if (!resp.success) throw new Error(resp.message);

      updateProduct({
        stock: {
          ...product.stock,
          quantity: resp.data.stock,
        },
      });
      reset(getValues(), { keepValues: true });
      enqueueSnackbar(t("success"), { variant: "success" });
      setOpenDialog(false);
      router.refresh();
    } catch (error: any) {
      console.log(error);
      enqueueSnackbar(t("error"), {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    setOpenDialog(false);
    reset();
  };

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
            />
          </Grid>
        </Grid>

        {isDirty && (
          <Button
            startIcon={<SaveTwoTone />}
            type="submit"
            disabled={loading}
            color="success"
            variant="contained"
            sx={{ mt: 2 }}
          >
            {t("save")}
          </Button>
        )}
      </form>

      <Dialog open={openDialog} onClose={onCancel} maxWidth="xs" fullWidth>
        <DialogTitle>{t("dialog.title")}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {t("dialog.text", { label: product.label, count: watch("stock") })}
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
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            color="primary"
          >
            {t("dialog.confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductUpdateStockForm;
