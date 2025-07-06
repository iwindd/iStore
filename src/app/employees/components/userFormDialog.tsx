'use client';
import { useInterface } from "@/providers/InterfaceProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { Role, User } from "@prisma/client";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { useQueryClient } from "@tanstack/react-query";
import { SaveTwoTone } from "@mui/icons-material";
import RoleSelector from "@/components/RoleSelector";
import { EmployeeSchema, EmployeeValues } from "@/schema/Employee";

interface UserFormDialogProps {
  onClose: () => void;
  isOpen: boolean;
  user: User | null;
}

const UserFormDialog = ({ isOpen, onClose, user }: UserFormDialogProps) => {
  const { setBackdrop } = useInterface();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
  } = useForm<EmployeeValues>({
    resolver: zodResolver(EmployeeSchema),
    defaultValues: {
      name: "",
      email: "",
      role: null,
    },
  });

  const submitRole: SubmitHandler<EmployeeValues> = async (payload: EmployeeValues) => {
    setBackdrop(true);
    try {
      reset();
      await queryClient.refetchQueries({ queryKey: ["employees"], type: "active" });
      enqueueSnackbar("บันทึกตำแหน่งเรียบร้อยแล้ว!", { variant: "success" });
      onClose();
    } catch (error) {
      enqueueSnackbar("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้งภายหลัง", {
        variant: "error",
      });
    } finally {
      setBackdrop(false);
    }
  };

  const onSelectRole = (role: Role) => {

  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit(submitRole),
      }}
    >
      <DialogTitle>{!user ? "เพิ่มพนักงาน" : "แก้ไขพนักงาน"}</DialogTitle>
      <DialogContent>
        <Stack sx={{ mt: 2 }}>
          <Stack flexDirection={"column"} spacing={1}>
            <TextField
              type="text"
              fullWidth
              label="ชื่อ"
              {...register("name")}
            />
            <TextField
              type="email"
              fullWidth
              label="อีเมล"
              {...register("email")}
            />
            <RoleSelector 
              onSubmit={onSelectRole} 
            />
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" type="button" onClick={onClose}>
          ปิด
        </Button>
        <Button
          variant="contained"
          color="success"
          startIcon={<SaveTwoTone />}
          type="submit"
        >
          บันทึก
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserFormDialog;
