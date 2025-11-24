"use client";
import { SearchCategory } from "@/actions/category/search";
import CreateProduct from "@/actions/product/create";
import GetProduct from "@/actions/product/find";
import recoveryProduct from "@/actions/product/recoveryProduct";
import UpdateProduct from "@/actions/product/update";
import CategorySelector from "@/components/CategorySelector";
import { ProductPermissionEnum } from "@/enums/permission";
import { useAuth } from "@/hooks/use-auth";
import { useDialog } from "@/hooks/use-dialog";
import { randomEan } from "@/libs/ean";
import { removeWhiteSpace } from "@/libs/formatter";
import { useInterface } from "@/providers/InterfaceProvider";
import {
  ProductFindSchema,
  ProductFindValues,
  ProductSchema,
  ProductValues,
} from "@/schema/Product";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AddTwoTone,
  Rotate90DegreesCcw,
  SaveTwoTone,
  SearchTwoTone,
} from "@mui/icons-material";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { Product } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface AddDialogProps {
  onClose: () => void;
  open: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface SearchDialogProps extends AddDialogProps {
  onSubmit: (product?: Product) => void;
}

export interface ProductFormDialogProps extends AddDialogProps {
  product: Product | null;
}

function SearchDialog({
  open,
  onClose,
  onSubmit,
  setLoading,
}: SearchDialogProps): React.JSX.Element {
  const [isRandomSerial, setIsRandomSerial] = React.useState<string>();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<ProductFindValues>({
    resolver: zodResolver(ProductFindSchema),
  });
  const { enqueueSnackbar } = useSnackbar();

  const searchSubmit: SubmitHandler<ProductFindValues> = async (
    payload: ProductFindValues
  ) => {
    setLoading(true);

    try {
      const resp = await GetProduct(payload.serial, true);
      if (!resp.success) throw Error("not_found");
      onSubmit(resp?.data || ({ serial: payload.serial } as Product));
    } catch (error) {
      enqueueSnackbar("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้งภายหลัง", {
        variant: "error",
      });
    } finally {
      reset();
      setLoading(false);
    }
  };

  const random = () => {
    const randomSerial = randomEan();
    setValue("serial", randomSerial);
    setIsRandomSerial(randomSerial);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      disableRestoreFocus
      slotProps={{
        paper: {
          component: "form",
          onSubmit: handleSubmit(searchSubmit),
        },
      }}
    >
      <DialogTitle>ค้นหาสินค้า</DialogTitle>
      <DialogContent>
        <Stack sx={{ mt: 2 }}>
          <TextField
            label="รหัสสินค้า"
            {...register("serial")}
            autoFocus
            placeholder="EAN8 or EAN13"
            error={errors["serial"] != undefined}
            helperText={
              errors["serial"]?.message ||
              (isRandomSerial == watch("serial") &&
                " สินค้าที่สร้างรหัสสินค้าจากระบบจะเป็นสินค้าที่ไม่มีรหัสสินค้า และสามารถ Export Barcode ได้ภายหลัง")
            }
            fullWidth
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="สร้างรหัสสินค้า">
                      <IconButton onClick={random}>
                        <Rotate90DegreesCcw />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              },

              inputLabel: { shrink: true },
            }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={handleClose}>
          ยกเลิก
        </Button>
        <Button variant="contained" startIcon={<SearchTwoTone />} type="submit">
          ค้นหา
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function ProductFormDialog({
  open,
  setLoading,
  onClose,
  product,
}: ProductFormDialogProps): React.JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<ProductValues>({
    resolver: zodResolver(ProductSchema),
  });

  const { enqueueSnackbar } = useSnackbar();
  const [defaultCategory, setDefaultCategory] = React.useState<number>(0);
  const queryClient = useQueryClient();

  const submitProduct: SubmitHandler<ProductValues> = async (
    payload: ProductValues
  ) => {
    try {
      if (product?.deleted_at) {
        const resp = await recoveryProduct(product.id);
        if (!resp.success) throw Error("error");
      } else {
        const resp = await (!product?.id
          ? CreateProduct(payload)
          : UpdateProduct(payload, product.id));
        if (!resp.success) throw Error(resp.message);
      }

      reset();
      await queryClient.refetchQueries({
        queryKey: ["products"],
        type: "active",
      });
      enqueueSnackbar("บันทึกสินค้าเรียบร้อยแล้ว!", { variant: "success" });
      onClose();
    } catch (error) {
      enqueueSnackbar("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้งภายหลัง", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setValue(
      "serial",
      (product?.serial && removeWhiteSpace(product.serial)) || ""
    );
    setValue("label", product?.label || "");
    setValue("price", product?.price || 0);
    setValue("stock_min", product?.stock_min || 0);
    setValue("cost", product?.cost || 0);
    setValue("keywords", product?.keywords || "");
    setValue("category_id", product?.category_id || 0);
    setDefaultCategory(product?.category_id || 0);
  }, [product, setValue]);

  const onSelectCategory = (category: SearchCategory) => {
    setValue("category_id", category?.id || 0);
  };

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
          return;
        }
        onClose();
      }}
      disableAutoFocus
      slotProps={{
        paper: {
          component: "form",
          onSubmit: handleSubmit(submitProduct),
        },
      }}
    >
      <DialogTitle>
        {product?.label ? "แก้ไขสินค้า" : "เพิ่มสินค้า"}
      </DialogTitle>
      <DialogContent>
        <Stack sx={{ mt: 2 }} spacing={1}>
          <Grid container spacing={1}>
            <Grid size={6}>
              <TextField
                fullWidth
                label="รหัสสินค้า"
                {...register("serial")}
                disabled
                hidden
              />
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                label="ชื่อสินค้า"
                error={errors["label"] !== undefined}
                helperText={errors["label"]?.message ?? ""}
                {...register("label")}
                autoFocus
              />
            </Grid>
            <Grid size={6}>
              <CategorySelector
                onSubmit={onSelectCategory}
                defaultValue={defaultCategory}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                label="ราคาสินค้า"
                error={errors["price"] !== undefined}
                helperText={errors["price"]?.message}
                {...register("price", { valueAsNumber: true })}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                label="ราคาต้นทุนสินค้า"
                error={errors["cost"] !== undefined}
                helperText={errors["cost"]?.message}
                {...register("cost", { valueAsNumber: true })}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                label="สต๊อกขั้นต่ำ"
                error={errors["stock_min"] !== undefined}
                helperText={errors["stock_min"]?.message}
                placeholder="สำหรับจัดการสต๊อกหรือแจ้งเตือน"
                {...register("stock_min", { valueAsNumber: true })}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="คีย์เวิร์ด"
                placeholder="เช่น รหัสสินค้าจากเว็บสั่งซื้อ ชื่ออื่นสำหรับค้นหา เป็นต้น"
                error={errors["keywords"] !== undefined}
                helperText={errors["keywords"]?.message}
                {...register("keywords")}
              />
            </Grid>
          </Grid>
          {product?.id && product?.deleted_at != null && (
            <Alert color="error">
              สินค้านี้ถูกลบไปแล้ว! หากคุณบันทึกสินค้านี้จะถูกกู้คืน{" "}
              {product.label}{" "}
            </Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={onClose}>
          ยกเลิก
        </Button>
        <Button
          variant="contained"
          startIcon={<SaveTwoTone />}
          color="success"
          type="submit"
        >
          {product && product?.deleted_at ? "กู้คืนและบันทึก" : "บันทึก"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const AddController = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const { setBackdrop, isBackdrop } = useInterface();
  const [isSearch, setIsSearch] = useState<boolean>(true);
  const { user } = useAuth();
  const dialogInfo = useDialog();

  const onOpen = () => {
    setIsSearch(true);
    dialogInfo.handleOpen();
  };

  const onClose = () => {
    setProduct(null);
    dialogInfo.handleClose();
  };

  const onSubmit = (foundProduct?: Product) => {
    setProduct(foundProduct ? foundProduct : null);
    setIsSearch(false);
  };

  if (!user) return null;
  if (!user.hasPermission(ProductPermissionEnum.CREATE)) return null;

  return (
    <>
      <Button
        startIcon={<AddTwoTone />}
        variant="contained"
        onClick={onOpen}
        size="small"
      >
        เพิ่มรายการ
      </Button>

      <SearchDialog
        open={dialogInfo.open && !isBackdrop && isSearch}
        onClose={onClose}
        setLoading={setBackdrop}
        onSubmit={onSubmit}
      />
      <ProductFormDialog
        open={dialogInfo.open && !isBackdrop && !isSearch}
        onClose={onClose}
        setLoading={setBackdrop}
        product={product}
      />
    </>
  );
};

export default AddController;
