"use client";

import updateProductKeywords from "@/actions/product/updateProductKeywords";
import { StorePermissionEnum } from "@/enums/permission";
import { usePermission } from "@/providers/PermissionProvider";
import {
  ProductUpdateKeywordsSchema,
  ProductUpdateKeywordsValues,
} from "@/schema/Product";
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveTwoTone } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  TextField,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useSnackbar } from "notistack";
import { useFieldArray, useForm } from "react-hook-form";
import { useProduct } from "../../../ProductContext";

const ProductKeywordsForm = () => {
  const t = useTranslations("PRODUCT_DETAIL.information.keywords_form");
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams<{ store: string }>();
  const permission = usePermission();
  const { product, updateProduct } = useProduct();

  const {
    handleSubmit,
    formState: { errors, isDirty },
    control,
    reset,
  } = useForm<ProductUpdateKeywordsValues>({
    resolver: zodResolver(ProductUpdateKeywordsSchema),
    defaultValues: {
      keywords: product.keywords.map((k) => ({ value: k })),
    },
  });

  const { fields: keywords, replace } = useFieldArray({
    control,
    name: "keywords",
  });

  const updateProductMutation = useMutation({
    mutationFn: (payload: ProductUpdateKeywordsValues) =>
      updateProductKeywords(params.store, {
        ...payload,
        id: product.id,
      }),
    onSuccess: (data) => {
      enqueueSnackbar(t("success"), { variant: "success" });
      reset({
        keywords: data.keywords.map((k) => ({ value: k })),
      });
      updateProduct({
        ...product,
        keywords: data.keywords,
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
          onSubmit={handleSubmit((data) =>
            updateProductMutation.mutateAsync(data),
          )}
        >
          <Grid container spacing={2}>
            <Grid size={12}>
              <Autocomplete
                multiple
                freeSolo
                options={[]}
                disabled={disabled}
                value={keywords.map((k) => k.value)}
                onChange={(event, value) => {
                  replace(value.map((v) => ({ value: v })));
                }}
                renderValue={(value: readonly string[], getTagProps) =>
                  value.map((option: string, index: number) => {
                    const { key, ...tagProps } = getTagProps({ index });
                    return (
                      <Chip
                        variant="filled"
                        label={option}
                        key={key}
                        {...tagProps}
                      />
                    );
                  })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label={t("title")}
                    placeholder={t("placeholder")}
                    error={!!errors.keywords}
                    helperText={errors.keywords?.message}
                  />
                )}
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

export default ProductKeywordsForm;
