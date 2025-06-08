"use client";
import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { enqueueSnackbar } from "notistack";
import { useInterface } from "@/providers/InterfaceProvider";
import { useDialog } from "@/hooks/use-dialog";
import { PasswordSchema, PasswordValues } from "@/schema/Password";
import UpdatePassword from "@/actions/user/password";
import { KeyTwoTone, SaveTwoTone } from "@mui/icons-material";

interface AddDialogProps {
  onClose: () => void;
  open: boolean;
}

export function ChangePasswordDialog({
  open,
  onClose,
}: AddDialogProps): React.JSX.Element {
  const { setBackdrop } = useInterface();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    reset,
  } = useForm<PasswordValues>({ resolver: zodResolver(PasswordSchema) });
  const onSubmit: SubmitHandler<PasswordValues> = async (
    payload: PasswordValues
  ) => {
    console.log(payload);
    setBackdrop(true);
    try {
      const resp = await UpdatePassword(payload);
      if (!resp.success) throw new Error(resp.message);
      reset();
      onClose();
      enqueueSnackbar("เปลี่ยนรหัสผ่านสำเร็จ!", { variant: "success" });
    } catch (error) {
      setValue("old_password", "");
      setError(
        "old_password",
        {
          type: "string",
          message: "รหัสผ่านเก่าไม่ถูกต้อง!",
        },
        { shouldFocus: true }
      );
    } finally {
      setBackdrop(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit(onSubmit),
      }}
    >
      <DialogTitle>เปลี่ยนรหัสผ่าน</DialogTitle>
      <DialogContent>
        <Stack sx={{ mt: 2 }} spacing={1}>
          <TextField
            type="password"
            label="รหัสผ่านเก่า"
            fullWidth
            {...register("old_password")}
            error={errors["old_password"] !== undefined}
            helperText={errors["old_password"]?.message}
          />
          <TextField
            type="password"
            label="รหัสผ่านใหม่"
            fullWidth
            {...register("password")}
            error={errors["password"] !== undefined}
            helperText={errors["password"]?.message}
          />
          <TextField
            type="password"
            label="ยืนยันรหัสผ่านใหม่"
            fullWidth
            {...register("password_confirmation")}
            error={errors["password_confirmation"] !== undefined}
            helperText={errors["password_confirmation"]?.message}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" type="button" onClick={onClose}>
          ปิด
        </Button>
        <Button variant="contained" color="success" startIcon={<SaveTwoTone/>} type="submit">บันทึก</Button>
      </DialogActions>
    </Dialog>
  );
}

const PasswordController = () => {
  const dialog = useDialog();
  const { isBackdrop } = useInterface();

  return (
    <>
      <Button
        variant="text"
        onClick={dialog.handleOpen}
        startIcon={<KeyTwoTone/>}
        sx={{
          justifyContent: "flex-start",
          "&:hover": {
            backgroundColor: "#0000",
            boxShadow: "none",
          },
        }}
      >
        เปลี่ยนรหัสผ่าน
      </Button>

      <ChangePasswordDialog
        open={dialog.open && !isBackdrop}
        onClose={dialog.handleClose}
      />
    </>
  );
};

export default PasswordController;
