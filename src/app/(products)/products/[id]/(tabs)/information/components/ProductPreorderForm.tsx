"use client";

import updatePreorder from "@/actions/product/updatePreorder";
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
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { Controller, useForm } from "react-hook-form";
import { useProduct } from "../../../ProductContext";

const ProductPreorderForm = () => {
  const t = useTranslations("PRODUCT_DETAIL.information.preorder_form");
  const { product, updateProduct } = useProduct();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const {
    handleSubmit,
    formState: { isDirty },
    reset,
    getValues,
    control,
  } = useForm<ProductPreorderValues>({
    resolver: zodResolver(ProductPreorderSchema),
    defaultValues: {
      usePreorder: product.usePreorder,
    },
  });

  const updatePreorderMutation = useMutation({
    mutationFn: async (data: ProductPreorderValues) => {
      const response = await updatePreorder(data, product.id);
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
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
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
              disabled={updatePreorderMutation.isPending}
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
