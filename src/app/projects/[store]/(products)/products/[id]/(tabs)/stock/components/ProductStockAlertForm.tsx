"use client";

import updateStockAlert from "@/actions/product/updateStockAlert";
import { StorePermissionEnum } from "@/enums/permission";
import { usePermission } from "@/providers/PermissionProvider";
import {
  ProductStockAlertSchema,
  ProductStockAlertValues,
} from "@/schema/Product";
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveTwoTone } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { Controller, useForm } from "react-hook-form";
import { useProduct } from "../../../ProductContext";

const ProductStockAlertForm = () => {
  const t = useTranslations("PRODUCT_DETAIL.stock.alert_form");
  const { product, updateProduct } = useProduct();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const params = useParams<{ store: string }>();
  const hasPermission = usePermission().hasStorePermission(
    StorePermissionEnum.PRODUCT_MANAGEMENT,
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    reset,
    getValues,
    control,
  } = useForm<ProductStockAlertValues>({
    resolver: zodResolver(ProductStockAlertSchema),
    defaultValues: {
      alertCount: product.stock.alertCount,
      useAlert: product.stock.useAlert,
    },
  });

  const updateStockAlertMutation = useMutation({
    mutationFn: async (payload: ProductStockAlertValues) =>
      updateStockAlert(params.store, {
        id: product.id,
        ...payload,
      }),
    onSuccess: (data) => {
      updateProduct({
        stock: {
          ...product.stock,
          alertCount: data.alertCount,
          useAlert: data.useAlert,
        },
      });

      enqueueSnackbar(t("success"), {
        variant: "success",
      });

      reset(getValues(), { keepValues: true });
      router.refresh();
    },
    onError: (error) => {
      console.log(error);
      enqueueSnackbar(t("error"), {
        variant: "error",
      });
    },
  });

  const disabled = !hasPermission || updateStockAlertMutation.isPending;

  return (
    <form
      onSubmit={handleSubmit((data) => updateStockAlertMutation.mutate(data))}
    >
      <Stack spacing={2} maxWidth={"500px"}>
        <div>
          <FormControlLabel
            control={
              <Controller
                name="useAlert"
                control={control}
                disabled={disabled}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    disabled={disabled}
                  />
                )}
              />
            }
            label={t("label")}
          />
          <Box>
            <Typography variant="body2" color="text.secondary">
              {t("helper")}
            </Typography>
          </Box>
        </div>
        {watch("useAlert") && (
          <TextField
            fullWidth
            label={t("count_label")}
            type="number"
            {...register("alertCount", { valueAsNumber: true })}
            error={!!errors.alertCount}
            helperText={errors.alertCount?.message}
            autoFocus
            disabled={disabled}
          />
        )}
      </Stack>

      {isDirty && (
        <Button
          startIcon={<SaveTwoTone />}
          type="submit"
          disabled={disabled}
          loading={updateStockAlertMutation.isPending}
          color="success"
          variant="contained"
          sx={{ mt: 2 }}
        >
          {t("save")}
        </Button>
      )}
    </form>
  );
};

export default ProductStockAlertForm;
