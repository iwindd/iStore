"use client";

import updateStockAlert from "@/actions/product/updateStockAlert";
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
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { useProduct } from "../../../ProductContext";

const ProductStockAlertForm = () => {
  const { product, updateProduct } = useProduct();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const defaultValues = {
    alertCount: product.stock?.alertCount ?? 0,
    useAlert: product.stock?.useAlert ?? false,
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    reset,
    getValues,
  } = useForm<ProductStockAlertValues>({
    resolver: zodResolver(ProductStockAlertSchema),
    defaultValues,
  });

  const updateStockAlertMutation = useMutation({
    mutationFn: async (data: ProductStockAlertValues) => {
      const response = await updateStockAlert(data, product.id);
      return response;
    },
    onSuccess: (data) => {
      updateProduct({
        stock: {
          ...product.stock,
          alertCount: data.alertCount,
          useAlert: data.useAlert,
        },
      });

      enqueueSnackbar("บันทึกการแจ้งเตือนสต๊อกเรียบร้อยแล้ว", {
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
    <form
      onSubmit={handleSubmit((data) => updateStockAlertMutation.mutate(data))}
    >
      <Stack spacing={2} maxWidth={"500px"}>
        <div>
          <FormControlLabel
            control={
              <Switch
                {...register("useAlert")}
                defaultChecked={defaultValues.useAlert}
              />
            }
            label="แจ้งเตือนสต๊อก"
          />
          <Box>
            <Typography variant="body2" color="text.secondary">
              เปิดการจัดการเมื่อจำนวนสต๊อกน้อยกว่าที่กำหนด
            </Typography>
          </Box>
        </div>
        {watch("useAlert") && (
          <TextField
            fullWidth
            label="จำนวนสต็อก"
            type="number"
            {...register("alertCount", { valueAsNumber: true })}
            error={!!errors.alertCount}
            helperText={errors.alertCount?.message}
            autoFocus
          />
        )}
      </Stack>

      {isDirty && (
        <Button
          startIcon={<SaveTwoTone />}
          type="submit"
          disabled={updateStockAlertMutation.isPending}
          color="success"
          variant="contained"
          sx={{ mt: 2 }}
        >
          บันทึก
        </Button>
      )}
    </form>
  );
};

export default ProductStockAlertForm;
