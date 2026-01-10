"use client";
import UpdateProduct from "@/actions/product/update";
import CategorySelector from "@/components/CategorySelector";
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
import { useSnackbar } from "notistack";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { SearchCategory } from "@/actions/category/search";
import { useRouter } from "next/navigation";
import { useProduct } from "../../../ProductContext";

const ProductUpdateForm = () => {
  const { product } = useProduct();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [defaultCategory, setDefaultCategory] = useState<number>(
    product.category?.id || 0
  );

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

  const onSelectCategory = (category: SearchCategory) => {
    setValue("category_id", category?.id || 0, { shouldDirty: true });
  };

  const onSubmit: SubmitHandler<ProductUpdateValues> = async (payload) => {
    setLoading(true);
    try {
      const resp = await UpdateProduct(payload, product.id);
      if (!resp.success) throw new Error(resp.message);

      enqueueSnackbar("บันทึกข้อมูลเรียบร้อยแล้ว", { variant: "success" });
      router.refresh();
      reset(payload); // Reset dirty state with new values
    } catch (error: any) {
      enqueueSnackbar(error.message || "เกิดข้อผิดพลาดในการบันทึก", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader
        title="แก้ไขข้อมูลสินค้า"
        subheader="ปรับปรุงข้อมูลรายละเอียดสินค้า"
      />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2} maxWidth={"500px"}>
            <Grid size={12}>
              <TextField
                fullWidth
                label="ชื่อสินค้า"
                {...register("label")}
                error={!!errors.label}
                helperText={errors.label?.message}
              />
            </Grid>

            <Grid size={12}>
              <CategorySelector
                onSubmit={onSelectCategory}
                defaultValue={defaultCategory}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="ราคาขาย"
                type="number"
                {...register("price", { valueAsNumber: true })}
                error={!!errors.price}
                helperText={errors.price?.message}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="ต้นทุน"
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
              บันทึก
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductUpdateForm;
