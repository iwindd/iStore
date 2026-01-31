"use client";
import UpdatePassword from "@/actions/user/password";
import { Confirmation, useConfirm } from "@/hooks/use-confirm";
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
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useSnackbar } from "notistack";
import { SubmitHandler, useForm } from "react-hook-form";

const FormPasswordChange = () => {
  const t = useTranslations("ACCOUNT.password");
  const { enqueueSnackbar } = useSnackbar();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<PasswordValues>({
    resolver: zodResolver(PasswordSchema),
    defaultValues: {
      old_password: "",
      password: "",
      password_confirmation: "",
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: (payload: PasswordValues) => UpdatePassword(payload),
    onSuccess: () => {
      enqueueSnackbar(t("messages.save_success"), {
        variant: "success",
      });
      reset();
    },
    onError: () => {
      enqueueSnackbar(t("messages.error"), {
        variant: "error",
      });
    },
  });

  const confirmation = useConfirm({
    title: t("confirm_dialog.title"),
    text: t("confirm_dialog.text"),
    onConfirm: async (payload: PasswordValues) => {
      updatePasswordMutation.mutate(payload);
    },
  });

  const onSubmit: SubmitHandler<PasswordValues> = async (payload) => {
    confirmation.with(payload);
    confirmation.handleOpen();
  };

  return (
    <>
      <Card component={"form"} onSubmit={handleSubmit(onSubmit)}>
        <CardHeader title={t("card_title")} />
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
              label={t("old_password_label")}
              fullWidth
              {...register("old_password")}
              error={errors["old_password"] !== undefined}
              helperText={errors["old_password"]?.message}
              disabled={updatePasswordMutation.isPending}
            />
            <TextField
              type="password"
              label={t("new_password_label")}
              fullWidth
              {...register("password")}
              error={errors["password"] !== undefined}
              helperText={errors["password"]?.message}
              disabled={updatePasswordMutation.isPending}
            />
            <TextField
              type="password"
              label={t("confirm_password_label")}
              fullWidth
              {...register("password_confirmation")}
              error={errors["password_confirmation"] !== undefined}
              helperText={errors["password_confirmation"]?.message}
              disabled={updatePasswordMutation.isPending}
            />
            {isDirty && (
              <div>
                <Button
                  type="submit"
                  color="success"
                  variant="contained"
                  startIcon={<SaveTwoTone />}
                  loading={updatePasswordMutation.isPending}
                >
                  {t("save_button")}
                </Button>
              </div>
            )}
          </Stack>
        </CardContent>
        <Divider />
      </Card>
      <Confirmation {...confirmation.props} />
    </>
  );
};

export default FormPasswordChange;
