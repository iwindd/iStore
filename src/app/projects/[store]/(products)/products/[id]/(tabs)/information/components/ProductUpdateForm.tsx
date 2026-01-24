"use client";
import UpdateProduct from "@/actions/product/update";
import CategorySelector from "@/components/Selector/CategorySelector";
import { ProductUpdateSchema, ProductUpdateValues } from "@/schema/Product";
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveTwoTone } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { SearchCategory } from "@/actions/category/search";
import { useRouter } from "next/navigation";
import { useProduct } from "../../../ProductContext";

const ProductUpdateForm = () => {
  const t = useTranslations("PRODUCT_DETAIL.information.update_form");
  const { product } = useProduct();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    reset,
  } = useForm<ProductUpdateValues>({
    resolver: zodResolver(ProductUpdateSchema),
    defaultValues: {
      ...product,
      category_id: product.category?.id || 0,
    },
  });

  const onSelectCategory = (category: SearchCategory | null) => {
    setValue("category_id", category?.id || 0, { shouldDirty: true });
  };

  const onSubmit: SubmitHandler<ProductUpdateValues> = async (payload) => {
    setLoading(true);
    try {
      const resp = await UpdateProduct(payload, product.id);
      if (!resp.success) throw new Error(resp.message);

      enqueueSnackbar(t("success"), { variant: "success" });
      router.refresh();
      reset(payload); // Reset dirty state with new values
    } catch (error: any) {
      enqueueSnackbar(error.message || t("error"), {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader title={t("title")} subheader={t("subheader")} />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2} maxWidth={"500px"}>
            <Grid size={12}>
              <TextField
                fullWidth
                label={t("label")}
                {...register("label")}
                error={!!errors.label}
                helperText={errors.label?.message}
              />
            </Grid>

            <Grid size={12}>
              <CategorySelector
                onSubmit={onSelectCategory}
                defaultValue={product.category?.id || 0}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label={t("price")}
                type="number"
                {...register("price", { valueAsNumber: true })}
                error={!!errors.price}
                helperText={errors.price?.message}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label={t("cost")}
                type="number"
                {...register("cost", { valueAsNumber: true })}
                error={!!errors.cost}
                helperText={errors.cost?.message}
              />
            </Grid>
          </Grid>

          {isDirty && (
            <Button
              startIcon={<SaveTwoTone />}
              onClick={handleSubmit(onSubmit)}
              disabled={loading || !isDirty}
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

export default ProductUpdateForm;
