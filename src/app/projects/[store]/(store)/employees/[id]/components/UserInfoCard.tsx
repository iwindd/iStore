"use client";

import { adminUpdateUserProfile } from "@/actions/user/adminUpdateUserProfile";
import HasGlobalPermission from "@/components/Flagments/HasGlobalPermission";
import { PermissionConfig } from "@/config/permissionConfig";
import { useDialog } from "@/hooks/use-dialog";
import { usePermission } from "@/providers/PermissionProvider";
import { ProfileSchema, ProfileValues } from "@/schema/Profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { LockReset, SaveTwoTone } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Stack,
  TextField,
} from "@mui/material";
import { User } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { enqueueSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import EditPassswordDialog from "./EditPassswordDialog";

interface UserInfoCardProps {
  user: User;
}

const UserInfoCard = ({ user }: UserInfoCardProps) => {
  const t = useTranslations("EMPLOYEES");
  const { open, handleOpen, handleClose } = useDialog();
  const hasPermission = usePermission().hasGlobalPermission(
    PermissionConfig.global.user.updateUser,
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileValues>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      first_name: user?.first_name,
      last_name: user?.last_name,
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: (payload: ProfileValues) =>
      adminUpdateUserProfile(user.id, payload),
    onSuccess: (data) => {
      enqueueSnackbar(t("messages.updated"), {
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

  const disabled = !hasPermission || updateUserMutation.isPending;

  return (
    <>
      <Card>
        <CardHeader
          title={t("form.general_info_card")}
          action={
            <HasGlobalPermission
              permission={PermissionConfig.global.user.updatePassword}
            >
              <Button
                startIcon={<LockReset />}
                variant="text"
                size="small"
                onClick={handleOpen}
              >
                {t("form.change_password_button")}
              </Button>
            </HasGlobalPermission>
          }
        />
        <CardContent>
          <Stack
            spacing={2}
            component="form"
            onSubmit={handleSubmit((data) =>
              updateUserMutation.mutateAsync(data),
            )}
          >
            <Grid container spacing={2} maxWidth={"500px"}>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label={t("form.first_name_label")}
                  {...register("first_name")}
                  error={!!errors.first_name}
                  helperText={errors.first_name?.message}
                  disabled={disabled}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label={t("form.last_name_label")}
                  {...register("last_name")}
                  error={!!errors.last_name}
                  helperText={errors.last_name?.message}
                  disabled={disabled}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label={t("form.email_label")}
                  value={user.email}
                  disabled
                />
              </Grid>
              <Grid size={12}>
                {isDirty && (
                  <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    startIcon={<SaveTwoTone />}
                    loading={updateUserMutation.isPending}
                  >
                    {t("form.save_button")}
                  </Button>
                )}
              </Grid>
            </Grid>
          </Stack>
        </CardContent>
      </Card>

      <HasGlobalPermission
        permission={PermissionConfig.global.user.updatePassword}
      >
        <EditPassswordDialog
          open={open}
          onClose={handleClose}
          userId={user.id}
        />
      </HasGlobalPermission>
    </>
  );
};

export default UserInfoCard;
