"use client";

import RoleSelector from "@/components/Selector/RoleSelector";
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
  TextField,
} from "@mui/material";
import { useTranslations } from "next-intl";
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
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EmployeeValues>({
    resolver: zodResolver(EmployeeSchema),
    defaultValues: initialValues || {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      roleId: 0,
    },
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {/* Card 1: General Info */}
        <Card>
          <CardHeader title={t("form.general_info_card")} />
          <CardContent>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label={t("form.first_name_label")}
                placeholder={t("form.first_name_placeholder")}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
                {...register("firstName")}
              />
              <TextField
                fullWidth
                label={t("form.last_name_label")}
                placeholder={t("form.last_name_placeholder")}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
                {...register("lastName")}
              />
              <TextField
                fullWidth
                type="email"
                label={t("form.email_label")}
                placeholder={t("form.email_placeholder")}
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register("email")}
              />
              <TextField
                fullWidth
                type="password"
                label={t("form.password_label")}
                placeholder={t("form.password_placeholder")}
                error={!!errors.password}
                helperText={
                  errors.password?.message || t("form.password_helper")
                }
                {...register("password")}
              />
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
