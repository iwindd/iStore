"use client";
import UpdateStock from "@/actions/product/updateStock";
import {
  ProductUpdateStockSchema,
  ProductUpdateStockValues,
} from "@/schema/Product";
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveTwoTone } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useProduct } from "../../../ProductContext";

const ProductUpdateStockForm = () => {
  const { product, updateProduct } = useProduct();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    reset,
    getValues,
  } = useForm<ProductUpdateStockValues>({
    resolver: zodResolver(ProductUpdateStockSchema),
    defaultValues: {
      stock: product.stock?.quantity || 0,
      note: "",
    },
  });

  const onSubmit = async (data: ProductUpdateStockValues) => {
    setLoading(true);
    try {
      const resp = await UpdateStock(data, product.id);
      if (!resp.success) throw new Error(resp.message);

      updateProduct({
        stock: {
          ...product.stock,
          quantity: resp.data.stock,
        },
      });
      reset(getValues(), { keepValues: true });
      enqueueSnackbar("อัปเดตสต็อกเรียบร้อยแล้ว", { variant: "success" });
      setOpenDialog(false);
      router.refresh();
    } catch (error: any) {
      console.log(error);
      enqueueSnackbar("เกิดข้อผิดพลาด กรุณาลองอีกครั้งในภายหลัง", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    setOpenDialog(false);
    reset();
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setOpenDialog(true);
        }}
      >
        <Grid container spacing={2} maxWidth={"500px"}>
          <Grid>
            <TextField
              fullWidth
              label="จำนวนสต็อก"
              type="number"
              {...register("stock", { valueAsNumber: true })}
              error={!!errors.stock}
              helperText={errors.stock?.message}
            />
          </Grid>
        </Grid>

        {isDirty && (
          <Button
            startIcon={<SaveTwoTone />}
            type="submit"
            disabled={loading}
            color="success"
            variant="contained"
            sx={{ mt: 2 }}
          >
            บันทึก
          </Button>
        )}
      </form>

      <Dialog open={openDialog} onClose={onCancel} maxWidth="xs" fullWidth>
        <DialogTitle>ยืนยันการปรับสต็อก</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            คุณต้องการที่จะแก้ไขสต็อกสินค้า {product.label} จำนวน
            {watch("stock")}รายการ หรือไม่
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="หมายเหตุ"
            fullWidth
            variant="standard"
            multiline
            rows={2}
            {...register("note")}
            error={!!errors.note}
            helperText={errors.note?.message}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel}>ยกเลิก</Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            color="primary"
          >
            ยืนยัน
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductUpdateStockForm;
