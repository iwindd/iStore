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
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { Controller, useForm } from "react-hook-form";
import { useProduct } from "../../../ProductContext";

const ProductPreorderForm = () => {
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

      enqueueSnackbar("บันทึกการอนุญาตสั่งซื้อล่วงหน้าเรียบร้อยแล้ว", {
        variant: "success",
      });

      reset(getValues(), { keepValues: true });
      router.refresh();
    },
    onError: (error) => {
      console.log(error);
      enqueueSnackbar("เกิดข้อผิดพลาดกรุณาลองอีกครั้งในภายหลัง", {
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
                label="พรีออเดอร์"
              />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  เปิดการอนุญาตให้ลูกค้าสามารถสั่งสั่งจองสินค้ารายการนี้ล่วงหน้าได้เมื่อสต๊อกหมด
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
              บันทึก
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductPreorderForm;
