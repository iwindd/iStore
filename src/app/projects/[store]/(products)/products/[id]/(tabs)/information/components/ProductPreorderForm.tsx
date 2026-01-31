"use client";

import updatePreorder from "@/actions/product/updatePreorder";
import { StorePermissionEnum } from "@/enums/permission";
import { usePermission } from "@/providers/PermissionProvider";
import { ProductPreorderSchema, ProductPreorderValues } from "@/schema/Product";
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveTwoTone } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControlLabel,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useSnackbar } from "notistack";
import { Controller, useForm } from "react-hook-form";
import { useProduct } from "../../../ProductContext";

const ProductPreorderForm = () => {
  const t = useTranslations("PRODUCT_DETAIL.information.preorder_form");
  const { product, updateProduct } = useProduct();
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams<{ store: string }>();
  const permission = usePermission();

  const {
    handleSubmit,
    formState: { isDirty },
    reset,
    control,
  } = useForm<ProductPreorderValues>({
    resolver: zodResolver(ProductPreorderSchema),
    defaultValues: {
      usePreorder: product.usePreorder,
    },
  });

  const updatePreorderMutation = useMutation({
    mutationFn: async (data: ProductPreorderValues) => {
      const response = await updatePreorder(params.store, {
        ...data,
        id: product.id,
      });
      return response;
    },
    onSuccess: (data) => {
      updateProduct({
        ...product,
        usePreorder: data.usePreorder,
      });

      enqueueSnackbar(t("success"), {
        variant: "success",
      });

      reset(data);
    },
    onError: (error) => {
      console.log(error);
      enqueueSnackbar(t("error"), {
        variant: "error",
      });
    },
  });

  const disabled =
    updatePreorderMutation.isPending ||
    !permission.hasStorePermission(StorePermissionEnum.PRODUCT_MANAGEMENT);

  return (
    <Card>
      <CardContent>
        <form
          onSubmit={handleSubmit((data) => updatePreorderMutation.mutate(data))}
        >
          <Stack spacing={2} maxWidth={"500px"}>
            <div>
              <FormControlLabel
                control={
                  <Controller
                    name="usePreorder"
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
          </Stack>

          {isDirty && (
            <Button
              startIcon={<SaveTwoTone />}
              type="submit"
              disabled={disabled}
              color="success"
              variant="contained"
              sx={{ mt: 2 }}
            >
              {t("save")}
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductPreorderForm;
