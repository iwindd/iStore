"use client";
import updateUserProfile from "@/actions/user/updateUserProfile";
import { useAuth } from "@/hooks/use-auth";
import { Confirmation, useConfirm } from "@/hooks/use-confirm";
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
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useSnackbar } from "notistack";
import { SubmitHandler, useForm } from "react-hook-form";

const FormAccountInfo = () => {
  const t = useTranslations("ACCOUNT.info");
  const { user, setName } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileValues>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      first_name: user?.firstName,
      last_name: user?.lastName,
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (data) => {
      setName(data.first_name, data.last_name);
      enqueueSnackbar(t("messages.save_success"), {
        variant: "success",
      });
      reset(data);
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
      enqueueSnackbar(t("messages.error"), {
        variant: "error",
      });
    },
  });

  const confirmation = useConfirm({
    title: t("confirm_dialog.title"),
    text: t("confirm_dialog.text"),
    onConfirm: updateUserMutation.mutateAsync,
  });

  const onSubmit: SubmitHandler<ProfileValues> = async (payload) => {
    confirmation.with(payload);
    confirmation.handleOpen();
  };

  return (
    <>
      <Card component={"form"} onSubmit={handleSubmit(onSubmit)}>
        <CardHeader title={t("card_title")} />
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
              label={t("first_name_label")}
              autoFocus
              {...register("first_name")}
              error={errors["first_name"] !== undefined}
              helperText={errors["first_name"]?.message}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PeopleTwoTone />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              label={t("last_name_label")}
              {...register("last_name")}
              error={errors["last_name"] !== undefined}
              helperText={errors["last_name"]?.message}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PeopleTwoTone />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              label={t("email_label")}
              value={user?.email || ""}
              disabled
              aria-readonly
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailTwoTone />
                    </InputAdornment>
                  ),
                },
              }}
            />
            {isDirty && (
              <div>
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  startIcon={<SaveTwoTone />}
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

export default FormAccountInfo;
