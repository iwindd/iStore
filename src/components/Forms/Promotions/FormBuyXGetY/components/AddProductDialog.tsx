"use client";
import Selector from "@/components/Selector";
import {
  AddProductDialogSchema,
  AddProductDialogValues,
} from "@/schema/Promotion/AddProductToOffer";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";

interface AddProductDialogProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit: (data: AddProductDialogValues) => void;
}

const AddProductDialog: React.FC<AddProductDialogProps> = ({
  open,
  title,
  onClose,
  onSubmit,
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<AddProductDialogValues>({
    resolver: zodResolver(AddProductDialogSchema),
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          component: "form",
          onSubmit: handleSubmit(onSubmit),
        },
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Selector
            onSubmit={(product) => {
              setValue("product_id", product?.id as number);
            }}
            fieldProps={{
              error: errors["product_id"] !== undefined,
              helperText: errors["product_id"]?.message,
            }}
          />
          <TextField
            label="จำนวน"
            type="number"
            error={errors.quantity != undefined}
            helperText={errors.quantity?.message}
            {...register("quantity", { valueAsNumber: true })}
            slotProps={{
              htmlInput: { min: 1 },
            }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>ยกเลิก</Button>
        <Button
          variant="contained"
          type="submit"
          color="success"
          endIcon={<ChevronRight />}
        >
          เพิ่มสินค้านี้
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProductDialog;
