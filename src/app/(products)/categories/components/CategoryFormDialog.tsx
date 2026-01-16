"use client";
import upsertCategory from "@/actions/category/upsertCategory";
import { CategorySchema, CategoryValues } from "@/schema/Category";
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveTwoTone } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Category } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import React from "react";
import { Controller, useForm } from "react-hook-form";

interface CategoryFormDialogProps {
  onClose: () => void;
  open: boolean;
  category?: Category | null;
}

export function CategoryFormDialog({
  open,
  onClose,
  category,
}: Readonly<CategoryFormDialogProps>): React.JSX.Element {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<CategoryValues>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      label: "",
      active: false,
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const { isPending, ...upsertMutattion } = useMutation({
    mutationFn: async (data: CategoryValues) =>
      await upsertCategory(data, category?.id),
    onSuccess: async () => {
      enqueueSnackbar("บันทึกสินค้าเรียบร้อยแล้ว!", { variant: "success" });
      handleClose();
      queryClient.invalidateQueries({
        queryKey: ["categories"],
        type: "active",
      });
    },
    onError: async () => {
      enqueueSnackbar("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้งภายหลัง", {
        variant: "error",
      });
    },
  });

  React.useEffect(() => {
    if (category) {
      reset({
        label: category.label,
        active: false,
      });
    } else {
      reset({
        label: "",
        active: false,
      });
    }
  }, [category, reset]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>
        {category ? "แก้ไขประเภทสินค้า" : "เพิ่มประเภทสินค้า"}
      </DialogTitle>
      <DialogContent>
        <Stack
          id="category-form"
          sx={{ mt: 2 }}
          component={"form"}
          onSubmit={handleSubmit((data) => upsertMutattion.mutate(data))}
        >
          <TextField
            label="ประเภทสินค้า"
            fullWidth
            {...register("label")}
            error={errors["label"] !== undefined}
            helperText={errors["label"]?.message}
            disabled={isPending}
          />
          <FormGroup sx={{ mt: 1 }}>
            <FormControlLabel
              control={
                <Controller
                  name="active"
                  control={control}
                  disabled={isPending}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      disabled={field.disabled}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  )}
                />
              }
              label="ใช้กับสินค้าที่ไม่มีหมวดหมู่"
            />
            <Box>
              <Typography variant="body2" color="text.secondary">
                สินค้าที่ไม่มีหมวดหมู่ทั้งหมดจะใช้หมวดหมู่นี้
              </Typography>
            </Box>
          </FormGroup>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          color="secondary"
          type="button"
          onClick={onClose}
          disabled={isPending}
        >
          ปิด
        </Button>
        <Button
          variant="contained"
          color="success"
          startIcon={<SaveTwoTone />}
          type="submit"
          form="category-form"
          loading={isPending}
        >
          บันทึก
        </Button>
      </DialogActions>
    </Dialog>
  );
}
