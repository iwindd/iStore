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
import { useTranslations } from "next-intl";
import { useSnackbar } from "notistack";
import { SubmitHandler, useForm } from "react-hook-form";

const AccountInfo = () => {
  const t = useTranslations("ACCOUNT.info");
  const { user, setName } = useAuth();
  const { setBackdrop } = useInterface();
  const { enqueueSnackbar } = useSnackbar();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileValues>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: user?.displayName,
    },
  });

  const confirmation = useConfirm({
    title: t("confirm_dialog.title"),
    text: t("confirm_dialog.text"),
    onConfirm: async (payload: ProfileValues) => {
      setBackdrop(true);
      try {
        const resp = await UpdateProfile(payload);
        if (!resp.success) throw new Error(resp.message);
        setName(resp.data.name);
        enqueueSnackbar(t("messages.save_success"), {
          variant: "success",
        });
      } catch (error) {
        console.error("Error updating profile:", error);
        enqueueSnackbar(t("messages.error"), {
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
              label={t("name_label")}
              autoFocus
              disabled={!user?.hasPermission(AccountPermissionEnum.UPDATE)}
              {...register("name")}
              error={errors["name"] !== undefined}
              helperText={errors["name"]?.message}
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
            {user?.hasPermission(AccountPermissionEnum.UPDATE) && (
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

export default AccountInfo;
