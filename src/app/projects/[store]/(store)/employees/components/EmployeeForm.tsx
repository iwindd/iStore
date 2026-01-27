"use client";

import HasGlobalPermission from "@/components/Flagments/HasGlobalPermission";
import RoleSelector from "@/components/Selector/RoleSelector";
import UserSelector from "@/components/Selector/UserSelector";
import { GlobalPermissionEnum } from "@/enums/permission";
import { EmployeeSchema, EmployeeValues } from "@/schema/Employee";
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveTwoTone } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { Controller, useForm } from "react-hook-form";

interface EmployeeFormProps {
  storeSlug: string;
  initialValues?: Partial<EmployeeValues>;
  isSubmitting?: boolean;
  onSubmit: (values: EmployeeValues) => unknown;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  storeSlug,
  initialValues,
  onSubmit,
  isSubmitting,
}) => {
  const t = useTranslations("EMPLOYEES");
  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EmployeeValues>({
    resolver: zodResolver(EmployeeSchema),
    defaultValues: initialValues || {
      userId: 0,
      roleId: 0,
    },
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {/* Card 1: User Selection */}
        <Card>
          <CardHeader
            title={t("form.user_card")}
            subheader={t("form.user_subtitle")}
          />
          <CardContent>
            <Stack spacing={2}>
              <Controller
                name="userId"
                control={control}
                render={({ field }) => (
                  <UserSelector
                    label={t("form.user_label")}
                    placeholder={t("form.user_placeholder")}
                    defaultValue={field.value || undefined}
                    onSubmit={(value) => field.onChange(value?.id)}
                    error={!!errors.userId}
                    helperText={errors.userId?.message}
                  />
                )}
              />
              <HasGlobalPermission
                permission={GlobalPermissionEnum.USER_MANAGEMENT}
              >
                <Typography variant="body2" color="text.secondary">
                  {t("form.create_new_user_hint")}{" "}
                  <Link
                    href="/users/new"
                    target="_blank"
                    style={{ textDecoration: "underline", color: "inherit" }}
                  >
                    {t("form.create_new_user_link")}
                  </Link>
                </Typography>
              </HasGlobalPermission>
            </Stack>
          </CardContent>
        </Card>

        {/* Card 2: Role */}
        <Card>
          <CardHeader title={t("form.role_card")} />
          <CardContent>
            <Controller
              name="roleId"
              control={control}
              render={({ field }) => (
                <RoleSelector
                  label={t("form.role_label")}
                  defaultValue={field.value || undefined}
                  onSubmit={(value) => field.onChange(value?.id || 0)}
                  error={!!errors.roleId}
                  helperText={errors.roleId?.message}
                />
              )}
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => router.push(`/projects/${storeSlug}/employees`)}
            disabled={isSubmitting}
          >
            {t("form.cancel_button")}
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="success"
            startIcon={<SaveTwoTone />}
            disabled={isSubmitting}
          >
            {t("form.save_button")}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default EmployeeForm;
