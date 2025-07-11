"use client";
import UpdatePassword from "@/actions/user/password";
import { useAuth } from "@/hooks/use-auth";
import { Confirmation, useConfirm } from "@/hooks/use-confirm";
import { useInterface } from "@/providers/InterfaceProvider";
import { PasswordSchema, PasswordValues } from "@/schema/Password";
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveTwoTone } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  TextField,
} from "@mui/material";
import { useSnackbar } from "notistack";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const PasswordChanger = () => {
  const { user, setName } = useAuth();
  const { setBackdrop } = useInterface();
  const { enqueueSnackbar } = useSnackbar();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordValues>({
    resolver: zodResolver(PasswordSchema),
    defaultValues: {
      old_password: "",
      password: "",
      password_confirmation: "",
    },
  });

  const confirmation = useConfirm({
    title: "แจ้งเตือน",
    text: "คุณต้องการที่จะแก้ไขรหัสผ่านหรือไม่?",
    onConfirm: async (payload: PasswordValues) => {
      setBackdrop(true);
      try {
        const resp = await UpdatePassword(payload);
        if (!resp.success) throw Error(resp.message);
        enqueueSnackbar("บันทึกรหัสผ่านเรียบร้อยแล้วใ!", {
          variant: "success",
        });
      } catch (error) {
        enqueueSnackbar("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้งภายหลัง", {
          variant: "error",
        });
      } finally {
        setBackdrop(false);
      }
    },
  });

  const onSubmit: SubmitHandler<PasswordValues> = async (payload) => {
    confirmation.with(payload);
    confirmation.handleOpen();
  };

  return (
    <>
      <Card component={"form"} onSubmit={handleSubmit(onSubmit)}>
        <CardHeader title="เปลี่ยนรหัสผ่าน" />
        <Divider />
        <CardContent>
          <Stack
            spacing={2}
            width={{
              xs: "100%",
              sm: "400px",
              md: "500px",
              lg: "600px",
            }}
          >
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
            <div>
              <Button
                type="submit"
                color="success"
                variant="contained"
                startIcon={<SaveTwoTone />}
              >
                บันทึก
              </Button>
            </div>
          </Stack>
        </CardContent>
        <Divider />
      </Card>
      <Confirmation {...confirmation.props} />
    </>
  );
};

export default PasswordChanger;
