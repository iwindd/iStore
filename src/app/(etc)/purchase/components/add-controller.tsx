"use client";
import CreatePurchase from "@/actions/purchase/create";
import { PurchasePermissionEnum } from "@/enums/permission";
import { useAuth } from "@/hooks/use-auth";
import { useDialog } from "@/hooks/use-dialog";
import { useInterface } from "@/providers/InterfaceProvider";
import { PurchaseSchema, PurchaseValues } from "@/schema/Purchase";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddTwoTone, CreditCardTwoTone } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface AddDialogProps {
  onClose: () => void;
  open: boolean;
}

export function PurchaseFormDialog({
  open,
  onClose,
}: AddDialogProps): React.JSX.Element {
  const { setBackdrop } = useInterface();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PurchaseValues>({
    resolver: zodResolver(PurchaseSchema),
    defaultValues: {
      label: "",
      cost: null as any, // number | null
      count: null as any, // number | null
      note: "",
    },
  });
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const onSubmit: SubmitHandler<PurchaseValues> = async (
    payload: PurchaseValues
  ) => {
    try {
      setBackdrop(true);
      const resp = await CreatePurchase(payload);
      if (!resp.success) throw Error("error");
      onClose();
      reset();
      await queryClient.refetchQueries({
        queryKey: ["purchase"],
        type: "active",
      });
      enqueueSnackbar("บันทึกการซื้อสินค้าเรียบร้อยแล้ว!", {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้งภายหลัง", {
        variant: "error",
      });
    } finally {
      setBackdrop(false);
    }
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
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: {
          component: "form",
          onSubmit: handleSubmit(onSubmit),
        }
      }}
    >
      <DialogTitle>ซื้อสินค้า</DialogTitle>
      <DialogContent>
        <Stack sx={{ mt: 1 }} spacing={1}>
          <TextField
            label="ชื่อสินค้า"
            fullWidth
            {...register("label")}
            error={errors["label"] !== undefined}
            helperText={errors["label"]?.message}
          />
          <Stack direction={"row"} spacing={1}>
            <TextField
              label="ราคา (ต่อหน่วย)"
              fullWidth
              {...register("cost", { valueAsNumber: true })}
              error={errors["cost"] !== undefined}
              helperText={errors["cost"]?.message}
            />
            <TextField
              label="จำนวน"
              fullWidth
              {...register("count", { valueAsNumber: true })}
              error={errors["count"] !== undefined}
              helperText={errors["count"]?.message}
            />
          </Stack>
          <TextField
            label="หมายเหตุ"
            fullWidth
            placeholder="เช่น ชื่อผู้ใช้ รหัสการสั่งจอง คำอธิบาย ข้อมูล คำชี้แจงเพิ่มเติม หรือ อื่นๆ"
            {...register("note")}
            error={errors["note"] !== undefined}
            helperText={errors["note"]?.message}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" type="button" onClick={onClose}>
          ปิด
        </Button>
        <Button
          color="success"
          variant="contained"
          startIcon={<CreditCardTwoTone />}
          type="submit"
        >
          ซื้อสินค้า
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const AddController = () => {
  const dialog = useDialog();
  const { isBackdrop } = useInterface();
  const { user } = useAuth();

  if (!user?.hasPermission(PurchasePermissionEnum.CREATE)) return null;

  return (
    <>
      <Button
        startIcon={<AddTwoTone />}
        variant="contained"
        size="small"
        onClick={dialog.handleOpen}
      >
        เพิ่มรายการ
      </Button>

      <PurchaseFormDialog
        open={dialog.open && !isBackdrop}
        onClose={dialog.handleClose}
      />
    </>
  );
};

export default AddController;
