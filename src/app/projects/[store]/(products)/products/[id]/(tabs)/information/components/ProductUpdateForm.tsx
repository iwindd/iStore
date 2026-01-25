"use client";
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
import { useForm } from "react-hook-form";

import { CategorySelectorInstance } from "@/actions/category/selectorCategory";
import updateProduct from "@/actions/product/update";
import { StorePermissionEnum } from "@/enums/permission";
import { usePermission } from "@/providers/PermissionProvider";
import { useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useProduct } from "../../../ProductContext";

const ProductUpdateForm = () => {
  const t = useTranslations("PRODUCT_DETAIL.information.update_form");
  const { product } = useProduct();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const params = useParams<{ store: string }>();
  const permission = usePermission();

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

  const onSelectCategory = (category: CategorySelectorInstance | null) => {
    setValue("category_id", category?.id || 0, { shouldDirty: true });
  };

  const updateProductMutation = useMutation({
    mutationFn: (payload: ProductUpdateValues) =>
      updateProduct(params.store, { ...payload, id: product.id }),
    onSuccess: (data) => {
      enqueueSnackbar(t("success"), { variant: "success" });
      router.refresh();
      reset({
        label: data.label,
        price: data.price,
        cost: data.cost,
        category_id: data.category_id,
      });
    },
    onError: () => {
      enqueueSnackbar(t("error"), {
        variant: "error",
      });
    },
  });

  const disabled =
    updateProductMutation.isPending ||
    !permission.hasStorePermission(StorePermissionEnum.PRODUCT_MANAGEMENT);

  return (
    <Card>
      <CardHeader title={t("title")} subheader={t("subheader")} />
      <CardContent>
        <form
          onSubmit={handleSubmit((data) => updateProductMutation.mutate(data))}
        >
          <Grid container spacing={2} maxWidth={"500px"}>
            <Grid size={12}>
              <TextField
                fullWidth
                label={t("label")}
                {...register("label")}
                error={!!errors.label}
                helperText={errors.label?.message}
                disabled={disabled}
              />
            </Grid>

            <Grid size={12}>
              <CategorySelector
                onSubmit={onSelectCategory}
                defaultValue={product.category?.id || 0}
                disabled={disabled}
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
                disabled={disabled}
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
                disabled={disabled}
              />
            </Grid>
          </Grid>

          {isDirty && (
            <Button
              startIcon={<SaveTwoTone />}
              disabled={!isDirty || disabled}
              color="success"
              variant="contained"
              sx={{ mt: 2 }}
              type="submit"
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
