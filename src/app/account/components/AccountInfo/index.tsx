"use client";
import UpdateProfile from "@/actions/user/update";
import { AccountPermissionEnum } from "@/enums/permission";
import { useAuth } from "@/hooks/use-auth";
import { Confirmation, useConfirm } from "@/hooks/use-confirm";
import { useInterface } from "@/providers/InterfaceProvider";
import { ProfileSchema, ProfileValues } from "@/schema/Profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmailTwoTone, PeopleTwoTone, SaveTwoTone } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import { useSnackbar } from "notistack";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const AccountInfo = () => {
  const { user, setName } = useAuth();
  const { setBackdrop } = useInterface();
  const { enqueueSnackbar } = useSnackbar();
  const { register, handleSubmit, formState: {errors} } = useForm<ProfileValues>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: user?.displayName,
    },
  });

  const confirmation = useConfirm({
    title: "แจ้งเตือน",
    text: "คุณต้องการที่จะแก้ไขโปรไฟล์หรือไม่?",
    onConfirm: async (payload: ProfileValues) => {
      setBackdrop(true);
      try {
        const resp = await UpdateProfile(payload);
        if (!resp.success) throw Error(resp.message);
        setName(resp.data.name);
        enqueueSnackbar("บันทึกข้อมูลผู้ใช้สำเร็จแล้ว!", {
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

  const onSubmit: SubmitHandler<ProfileValues> = async (payload) => {
    confirmation.with(payload);
    confirmation.handleOpen();
  };

  return (
    <>
      <Card component={"form"} onSubmit={handleSubmit(onSubmit)}>
        <CardHeader title="ข้อมูลผู้ใช้" />
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PeopleTwoTone />
                  </InputAdornment>
                ),
              }}
              label="ชื่อ"
              autoFocus
              disabled={!user?.hasPermission(AccountPermissionEnum.UPDATE)}
              {...register("name")}
              error={errors["name"] !== undefined}
              helperText={errors["name"]?.message}
            />
            <TextField
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailTwoTone />
                  </InputAdornment>
                ),
              }}
              label="อีเมล"
              value={user?.email || ""}
              disabled
              aria-readonly
            />
            {
              user?.hasPermission(AccountPermissionEnum.UPDATE) && (
                <div>
                  <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    startIcon={<SaveTwoTone />}
                  >
                    บันทึก
                  </Button>
                </div>
              )
            }
          </Stack>
        </CardContent>
        <Divider />
      </Card>
      <Confirmation {...confirmation.props} />
    </>
  );
};

export default AccountInfo;
