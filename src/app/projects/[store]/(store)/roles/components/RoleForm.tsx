"use client";

import { RoleSchema, RoleValues } from "@/schema/Role";
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
import PermissionGrid from "./PermissionGrid";

interface RoleFormProps {
  storeSlug: string;
  initialValues?: RoleValues;
  roleId?: number;
  isSubmitting?: boolean;
  onSubmit: (values: RoleValues) => unknown;
}

const RoleForm: React.FC<RoleFormProps> = ({
  storeSlug,
  initialValues,
  onSubmit,
  isSubmitting,
}) => {
  const t = useTranslations("ROLES");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RoleValues>({
    resolver: zodResolver(RoleSchema),
    defaultValues: initialValues || {
      label: "",
      description: "",
      permissions: [],
    },
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {/* Card 1: Role Information */}
        <Card>
          <CardHeader title={t("form.role_info_card")} />
          <CardContent>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label={t("form.name_label")}
                placeholder={t("form.name_placeholder")}
                error={!!errors.label}
                helperText={errors.label?.message}
                {...register("label")}
              />
              <TextField
                fullWidth
                multiline
                rows={3}
                label={t("form.description_label")}
                placeholder={t("form.description_placeholder")}
                error={!!errors.description}
                helperText={errors.description?.message}
                {...register("description")}
              />
            </Stack>
          </CardContent>
        </Card>

        {/* Card 2: Permissions */}
        <Controller
          name="permissions"
          control={control}
          render={({ field }) => (
            <PermissionGrid
              value={field.value}
              onChange={field.onChange}
              error={errors.permissions?.message}
            />
          )}
        />

        {/* Action Buttons */}
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => router.push(`/projects/${storeSlug}/roles`)}
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

export default RoleForm;
