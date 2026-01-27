"use client";

import createUser from "@/actions/user/createUser";
import { CreateUserSchema, CreateUserValues } from "@/schema/User";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Card,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useForm } from "react-hook-form";

export default function UserForm() {
  const t = useTranslations("USERS.create");
  const formT = useTranslations("USERS.create.form");
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<CreateUserValues>({
    resolver: zodResolver(CreateUserSchema),
  });

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"], exact: true });
      enqueueSnackbar(t("messages.created"), {
        variant: "success",
      });
      router.push("/users");
    },
    onError: (error) => {
      if (error.message == "EMAIL_ALREADY_EXISTS") {
        return setError("email", {
          message: t("messages.EMAIL_ALREADY_EXISTS"),
        });
      }

      console.error(error);
      enqueueSnackbar(t("messages.error"), {
        variant: "error",
      });
    },
  });

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            {t("title")}
          </Typography>
          <Typography color="text.secondary">{t("subtitle")}</Typography>
        </Box>

        <Card sx={{ p: 3 }}>
          <Stack
            component="form"
            onSubmit={handleSubmit((data) =>
              createUserMutation.mutateAsync(data),
            )}
            spacing={2}
          >
            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                label={formT("first_name")}
                {...register("first_name")}
                disabled={createUserMutation.isPending}
                error={!!errors.first_name}
                helperText={errors.first_name?.message}
              />
              <TextField
                fullWidth
                label={formT("last_name")}
                {...register("last_name")}
                disabled={createUserMutation.isPending}
                error={!!errors.last_name}
                helperText={errors.last_name?.message}
              />
            </Stack>

            <TextField
              fullWidth
              label={formT("email")}
              type="email"
              {...register("email")}
              disabled={createUserMutation.isPending}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              fullWidth
              label={formT("password")}
              type="password"
              {...register("password")}
              disabled={createUserMutation.isPending}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => router.back()}
                disabled={createUserMutation.isPending}
              >
                {formT("cancel")}
              </Button>
              <Button
                type="submit"
                variant="contained"
                loading={createUserMutation.isPending}
              >
                {formT("submit")}
              </Button>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
