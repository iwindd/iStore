"use client";

import { adminUpdatePassword } from "@/actions/user/adminUpdatePassword";
import { SetPasswordSchema, SetPasswordValues } from "@/schema/Password";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { enqueueSnackbar } from "notistack";
import { useForm } from "react-hook-form";

const EditPassswordDialog = ({
  open,
  onClose,
  userId,
}: {
  open: boolean;
  onClose: () => void;
  userId: number;
}) => {
  const t = useTranslations("EMPLOYEES");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SetPasswordValues>({
    resolver: zodResolver(SetPasswordSchema),
  });

  const changePasswordMutation = useMutation({
    mutationFn: (values: SetPasswordValues) =>
      adminUpdatePassword(userId, values),
    onSuccess: () => {
      enqueueSnackbar(t("messages.updated"), { variant: "success" });
      onClose();
      reset();
    },
    onError: (error) => {
      console.error(error);
      enqueueSnackbar(t("messages.error"), { variant: "error" });
    },
  });

  const onSubmit = (values: SetPasswordValues) => {
    changePasswordMutation.mutate(values);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{t("form.change_password_title")}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1, minWidth: 400 }}>
            <TextField
              fullWidth
              type="password"
              label={t("form.new_password_label")}
              placeholder={t("form.password_placeholder")}
              error={!!errors.password}
              helperText={errors.password?.message}
              {...register("password")}
            />
            <TextField
              fullWidth
              type="password"
              label={t("form.confirm_password_label")}
              placeholder={t("form.password_placeholder")}
              error={!!errors.password_confirmation}
              helperText={errors.password_confirmation?.message}
              {...register("password_confirmation")}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit">
            {t("form.cancel_button")}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={changePasswordMutation.isPending}
          >
            {t("form.confirm_change_password")}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditPassswordDialog;
