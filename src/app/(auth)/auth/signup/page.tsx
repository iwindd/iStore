"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EmailTwoTone,
  LoginTwoTone,
  NumbersTwoTone,
  PeopleTwoTone,
} from "@mui/icons-material";
import {
  Avatar,
  Button,
  Container,
  Divider,
  InputAdornment,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { SignUpSchema, SignUpValues } from "@/schema/Signup";
import Signup from "@/actions/user/signup";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import RouterLink from "next/link";
import { useInterface } from "@/providers/InterfaceProvider";

const SignIn = () => {
  const { setBackdrop } = useInterface();
  const {
    register,
    handleSubmit,
    resetField,
    setError,
    formState: { errors },
  } = useForm<SignUpValues>({
    resolver: zodResolver(SignUpSchema),
  });

  const router = useRouter();

  const onSubmit: SubmitHandler<SignUpValues> = async (
    payload: SignUpValues
  ) => {
    try {
      setBackdrop(true);
      const resp = await Signup(payload);
      if (!resp.success) throw Error("signUpError");
      const resp2 = await signIn("credentials", {
        ...payload,
        redirect: false,
      });

      router.push(resp2 && resp2.ok ? "/" : "/auth/signin");
      router.refresh();
    } catch (error) {
      resetField("email");
      setError(
        "email",
        {
          type: "string",
          message: "อีเมลนี้ถูกใช้ไปแล้ว!",
        },
        { shouldFocus: true }
      );
    } finally {
      setBackdrop(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper>
        <Stack
          mt={8}
          direction={"column"}
          spacing={1}
          boxShadow={"lg"}
          component={"form"}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Stack
            alignItems={"center"}
            spacing={2}
            direction={"row"}
            px={3}
            pt={2}
            pb={1}
          >
            <Avatar>
              <LoginTwoTone />
            </Avatar>
            <Typography variant="h5">ลงทะเบียนร้านค้า</Typography>
          </Stack>
          <Divider />
          <Stack px={3} pt={1} spacing={1}>
            <TextField
              fullWidth
              placeholder="ชื่อ"
              error={!!errors["name"]?.message}
              helperText={errors["name"]?.message}
              autoFocus
              {...register("name")}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PeopleTwoTone />
                    </InputAdornment>
                  ),
                }
              }} />
            <TextField
              fullWidth
              placeholder="อีเมล"
              error={!!errors["email"]?.message}
              helperText={errors["email"]?.message}
              {...register("email")}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailTwoTone />
                    </InputAdornment>
                  ),
                }
              }} />
            <TextField
              type="password"
              fullWidth
              placeholder="รหัสผ่าน"
              error={!!errors["password"]?.message}
              helperText={errors["password"]?.message}
              {...register("password")}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <NumbersTwoTone />
                    </InputAdornment>
                  ),
                }
              }} />
            <TextField
              type="password"
              fullWidth
              placeholder="ยืนยันรหัสผ่าน"
              error={!!errors["password_confirmation"]?.message}
              helperText={errors["password_confirmation"]?.message}
              {...register("password_confirmation")}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <NumbersTwoTone />
                    </InputAdornment>
                  ),
                }
              }} />
          </Stack>

          <Stack
            justifyContent={"center"}
            alignItems={"center"}
            spacing={1.5}
            px={3}
            pb={2}
            mt={2}
          >
            <Button
              type="submit"
              variant="contained"
              fullWidth
              startIcon={<LoginTwoTone />}
            >
              ลงทะเบียน
            </Button>
            <Link component={RouterLink} href={"/auth/signin"}>
              ฉันมีบัญชีอยู่แล้ว?
            </Link>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
};

export default SignIn;
