"use client";
import { SignInSchema, SignInValues } from "@/schema/Signin";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LoginTwoTone,
  NumbersTwoTone,
  PeopleTwoTone,
} from "@mui/icons-material";
import {
  Avatar,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  InputAdornment,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { signIn, useSession } from "next-auth/react";
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
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(SignInSchema),
  });

  const { data: session } = useSession();
  const router = useRouter();

  const onSubmit: SubmitHandler<SignInValues> = async (
    payload: SignInValues
  ) => {
    if (session) return router.push("/");
    setBackdrop(true);
    try {
      const resp = await signIn("credentials", {
        ...payload,
        redirect: false,
      });

      if (resp && resp.ok) {
        router.push("/");
        router.refresh();
      } else {
        throw Error("no_response");
      }
    } catch (error) {
      resetField("password");
      setError(
        "email",
        {
          type: "string",
          message: "ไม่พบผู้ใช้งาน",
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
            <Typography variant="h5">เข้าสู่ระบบ</Typography>
          </Stack>
          <Divider />
          <Stack px={3} pt={1} spacing={1}>
            <TextField
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PeopleTwoTone />
                  </InputAdornment>
                ),
              }}
              fullWidth
              placeholder="อีเมล"
              error={!!errors["email"]?.message}
              helperText={errors["email"]?.message}
              {...register("email")}
            />
            <TextField
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <NumbersTwoTone />
                  </InputAdornment>
                ),
              }}
              type="password"
              fullWidth
              placeholder="รหัสผ่าน"
              error={!!errors["password"]?.message}
              helperText={errors["password"]?.message}
              {...register("password")}
            />
            {/* TODO:: Remember me, reset password        
            <Stack
              sx={{ width: "100%" }}
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label="จดจำฉันไว้"
              />
              <Link
                color={"error"}
                component={RouterLink}
                href={"/auth/signup"}
              >
                ลืมรหัสผ่าน
              </Link>
            </Stack> 
            */}
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
              startIcon={<LoginTwoTone />}
              disabled={isSubmitting}
              fullWidth
            >
              เข้าสู่ระบบ
            </Button>
            <Link component={RouterLink} href={"/auth/signup"}>
              ฉันไม่มีบัญชี?
            </Link>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
};

export default SignIn;
