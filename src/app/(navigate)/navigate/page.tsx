"use client";
import GradientCircularProgress from "@/components/Loading/GradientCircularProgress";
import { getPath } from "@/router";
import { Stack, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const NavigatePath = () => {
  const t = useTranslations("NAVIGATE");
  const auth = useSession();
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    if (auth.status === "authenticated") {
      queryClient.clear();

      router.push(getPath("overview"));
    } else {
      router.push(getPath("auth.signin"));
    }
  }, [auth, queryClient, router]);

  return (
    <Stack pt={10} spacing={3} alignItems={"center"}>
      <GradientCircularProgress />
      <Typography variant="h6">{t("loading")}</Typography>
    </Stack>
  );
};

export default NavigatePath;
