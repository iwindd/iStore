"use client";
import CreateProduct from "@/actions/product/create";
import recoveryProduct from "@/actions/product/recoveryProduct";
import { ProductPermissionEnum } from "@/enums/permission";
import { useAuth } from "@/hooks/use-auth";
import { getPath } from "@/router";
import { ProductSchema, ProductValues } from "@/schema/Product";
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveTwoTone } from "@mui/icons-material";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { ProductFormDialogProps } from "./types";

const ProductFormDialog = ({
  open,
  onClose,
  product,
}: Readonly<ProductFormDialogProps>): React.JSX.Element => {
  const t = useTranslations("PRODUCTS.form_dialog");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductValues>({
    resolver: zodResolver(ProductSchema),
  });

  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: ProductValues) => {
      if (product?.deleted_at) {
        const resp = await recoveryProduct(product.id);
        if (!resp.success) throw new Error("error");
        return { type: "recovery", id: product.id };
      }

      const resp = await CreateProduct(payload);
      if (!resp.success) throw new Error(resp.message);
      return { type: "create", id: resp?.data?.id };
    },
    onSuccess: async (data) => {
      reset();
      enqueueSnackbar(t("save_success"), { variant: "success" });
      router.push(
        getPath("store.products.product", { id: data.id.toString() }),
      );
      await queryClient.invalidateQueries({
        queryKey: ["products"],
        type: "active",
      });
    },
    onError: (error) => {
      console.error(error);
      enqueueSnackbar(t("save_error"), {
        variant: "error",
      });
    },
  });

  useEffect(() => {
    if (product) {
      reset({
        serial: product.serial,
        label: product.label,
      });
    }
  }, [product, reset]);

  const submitProduct: SubmitHandler<ProductValues> = (
    payload: ProductValues,
  ) => {
    mutate(payload);
  };

  return (
    <Dialog
      open={open}
      disableEscapeKeyDown
      disableAutoFocus
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: {
          component: "form",
          onSubmit: (e: React.FormEvent) => {
            handleSubmit(submitProduct)(e);
          },
        },
      }}
    >
      <DialogTitle>
        {product?.label ? t("edit_title") : t("add_title")}
      </DialogTitle>
      <DialogContent>
        <Stack sx={{ mt: 2 }} spacing={1}>
          <TextField
            fullWidth
            label={t("label")}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            disabled={isPending || product?.deleted_at != null}
            placeholder={t("placeholder")}
            error={errors["label"] !== undefined}
            helperText={
              errors["label"]?.message ??
              t("serial_helper", { serial: product?.serial ?? "" })
            }
            {...register("label")}
            autoFocus
          />
          {product?.id && product?.deleted_at != null && (
            <Alert color="error">{t("deleted_alert")}</Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={onClose} disabled={isPending}>
          {t("cancel")}
        </Button>
        <Button
          variant="contained"
          startIcon={<SaveTwoTone />}
          color="success"
          type="submit"
          loading={isPending}
          sx={{
            display:
              product?.id && !user?.hasPermission(ProductPermissionEnum.UPDATE)
                ? "none"
                : "",
          }}
        >
          {product?.deleted_at ? t("recovery") : t("save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductFormDialog;
