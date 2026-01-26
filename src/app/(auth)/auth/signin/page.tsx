"use client";

import Logo from "@/components/core/logo";
import { useInterface } from "@/providers/InterfaceProvider";
import { SignInSchema, SignInValues } from "@/schema/Signin";
import { zodResolver } from "@hookform/resolvers/zod";
import { LockOutline, Login, PersonOutline } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { signIn, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

const SignIn = () => {
  const t = useTranslations("ROUTES.auth.signin");
  const { setBackdrop } = useInterface();
  const theme = useTheme();

  const {
    register,
    handleSubmit,
    resetField,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const { data: session } = useSession();
  const router = useRouter();

  const onSubmit: SubmitHandler<SignInValues> = async (payload) => {
    if (session) return router.push("/");
    try {
      const resp = await signIn("credentials", {
        ...payload,
        redirect: false,
      });

      if (!resp?.ok) throw new Error("no_response");
      if (resp.error != undefined) throw new Error(resp.error);

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error(error);
      resetField("password");
      setError(
        "email",
        {
          type: "string",
          message: "ไม่พบผู้ใช้งาน",
        },
        { shouldFocus: true },
      );
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",
        bgcolor: "grey.50",
      }}
    >
      {/* Container Card */}
      <Box
        sx={{
          display: "flex",
          width: "100%",
          maxWidth: 1000,
          margin: "auto",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: theme.shadows[10],
          overflow: "hidden",
          minHeight: 600,
        }}
      >
        {/* Left Side - Blue Section */}
        <Box
          sx={{
            flex: 1,
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            background: `linear-gradient(to bottom right, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`, // Use theme primary color
            color: "white",
            p: 6,
            textAlign: "center",
          }}
        >
          {/* Decorative Elements */}
          <Box
            sx={{
              position: "absolute",
              top: 40,
              left: 40,
              width: 80,
              height: 80,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: 100,
              right: 80,
              width: 16,
              height: 16,
              borderRadius: "50%",
              bgcolor: "rgba(255,255,255,0.3)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: 80,
              left: 80,
              width: 240,
              height: 240,
              borderRadius: "50%",
              bgcolor: "rgba(255,255,255,0.05)",
              filter: "blur(40px)",
            }}
          />

          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={1}
              sx={{ mb: 10, color: "primary.100" }}
            >
              {/* Placeholder Logo */}
              <Logo color="neutral" />
              <Typography
                variant="subtitle2"
                sx={{ letterSpacing: 1, fontWeight: 600 }}
              >
                {process.env.NEXT_PUBLIC_APP_NAME}
              </Typography>
            </Stack>

            <Typography
              variant="h6"
              sx={{ fontWeight: 500, mb: 1, color: "primary.50" }}
            >
              {t("niceToSeeYou")}
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 3 }}>
              {t("welcomeBack")}
            </Typography>
            <Box
              sx={{
                width: 60,
                height: 4,
                bgcolor: "white",
                borderRadius: 2,
                mx: "auto",
                mb: 4,
              }}
            />

            <Typography
              variant="body2"
              sx={{ maxWidth: 300, mx: "auto", opacity: 0.8, lineHeight: 1.6 }}
            >
              {t("subscribeDesc")}
            </Typography>
          </Box>
        </Box>
        {/* Right Side - Login Form */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            p: { xs: 4, md: 8 },
            bgcolor: "background.paper",
          }}
        >
          <Box sx={{ maxWidth: 400, width: "100%", mx: "auto" }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "primary.main", mb: 1 }}
            >
              {t("loginAccount")}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              {t("loginDesc")}
            </Typography>

            <Stack
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              spacing={3}
            >
              <TextField
                fullWidth
                label={t("emailLabel")}
                placeholder={t("emailPlaceholder")}
                error={!!errors.email}
                helperText={errors.email?.message}
                disabled={isSubmitting}
                {...register("email")}
                autoFocus
                variant="outlined"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutline />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                fullWidth
                type="password"
                label={t("passwordLabel")}
                placeholder={t("passwordPlaceholder")}
                error={!!errors.password}
                helperText={errors.password?.message}
                disabled={isSubmitting}
                {...register("password")}
                variant="outlined"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutline />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      {...register("rememberMe")}
                      disabled={isSubmitting}
                      sx={{
                        "&.Mui-checked": { color: "primary.main" },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" color="text.secondary">
                      {t("keepMeSignedIn")}
                    </Typography>
                  }
                />
              </Stack>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isSubmitting}
                size="large"
                sx={{
                  py: 1.5,
                  fontWeight: 700,
                  fontSize: "1rem",
                  textTransform: "none",
                  boxShadow: theme.shadows[4],
                  "&:hover": {
                    boxShadow: theme.shadows[8],
                  },
                }}
                endIcon={<Login />}
                loading={isSubmitting}
              >
                {t("subscribe")}
              </Button>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SignIn;
