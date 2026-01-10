"use client";
import * as Actions from "@/actions/employee";
import RoleSelector from "@/components/RoleSelector";
import { useInterface } from "@/providers/InterfaceProvider";
import { EmployeeSchema, EmployeeValues } from "@/schema/Employee";
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveTwoTone } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { Role, User } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface UserFormDialogProps {
  onClose: () => void;
  isOpen: boolean;
  user: User | null;
}

const UserFormDialog = ({ isOpen, onClose, user }: UserFormDialogProps) => {
  const { setBackdrop } = useInterface();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [defaultRole, setDefaultRole] = React.useState<number>(0);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EmployeeValues>({
    resolver: zodResolver(EmployeeSchema),
    defaultValues: {
      name: "",
      email: "",
      role: null,
    },
  });

  const submitRole: SubmitHandler<EmployeeValues> = async (
    payload: EmployeeValues
  ) => {
    setBackdrop(true);
    try {
      const resp = await (!user
        ? Actions.create(payload)
        : Actions.update(payload, (user as User).id));
      if (!resp || !resp.success)
        throw Error(resp?.message || "Unknown error occurred");
      reset();
      await queryClient.refetchQueries({
        queryKey: ["employees"],
        type: "active",
      });
      enqueueSnackbar("บันทึกตำแหน่งเรียบร้อยแล้ว!", { variant: "success" });
      onClose();
    } catch (error) {
      console.error("Error submitting role:", error);
      enqueueSnackbar("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้งภายหลัง", {
        variant: "error",
      });
    } finally {
      setBackdrop(false);
    }
  };

  const onSelectRole = (role: Role) => setValue("role", role ? role.id : 0);

  React.useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("email", user.email);
      const roleId: number = (user as any).employees?.[0]?.role?.id || null;
      setValue("role", roleId || 0);
      setDefaultRole(roleId || 0);
    }
  }, [user, setValue]);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: {
          component: "form",
          onSubmit: handleSubmit(submitRole),
        },
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
              error={!!errors["name"]?.message}
              helperText={errors["name"]?.message}
              {...register("name")}
            />
            <TextField
              type="email"
              fullWidth
              label="อีเมล"
              disabled={!!user}
              error={!!errors["email"]?.message}
              helperText={errors["email"]?.message}
              {...register("email")}
            />
            <RoleSelector
              onSubmit={onSelectRole}
              defaultValue={defaultRole}
              error={!!errors["role"]?.message}
              helperText={errors["role"]?.message}
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
