"use client";

import updateStoreEmployee from "@/actions/employee/updateStoreEmployee";
import RoleSelector from "@/components/Selector/RoleSelector";
import {
  EmployeeUpdateRoleSchema,
  EmployeeUpdateRoleValues,
} from "@/schema/Employee";
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveTwoTone } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Stack,
} from "@mui/material";
import { Employee } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { enqueueSnackbar } from "notistack";
import { Controller, useForm } from "react-hook-form";

interface EmployeeRoleCardProps {
  employee: Employee;
  storeSlug: string;
}

const EmployeeRoleCard = ({ employee, storeSlug }: EmployeeRoleCardProps) => {
  const t = useTranslations("EMPLOYEES");

  const {
    control,
    handleSubmit,
    formState: { isDirty, errors },
    reset,
  } = useForm({
    resolver: zodResolver(EmployeeUpdateRoleSchema),
    defaultValues: {
      roleId: employee.role_id,
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: (values: EmployeeUpdateRoleValues) =>
      updateStoreEmployee(storeSlug, {
        ...values,
        id: employee.id,
      }),
    onSuccess: (data) => {
      enqueueSnackbar(t("messages.updated"), { variant: "success" });
      reset({
        roleId: data.role_id,
      });
    },
    onError: (error) => {
      console.error(error);
      enqueueSnackbar(t("messages.error"), { variant: "error" });
    },
  });

  const onSubmit = (values: { roleId: number }) => {
    updateRoleMutation.mutate(values);
  };

  return (
    <Card>
      <CardHeader
        title={t("form.role_card")}
        subheader={t("form.role_card_subtitle")}
      />
      <CardContent>
        <Stack spacing={2} component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2} maxWidth={"500px"}>
            <Grid size={12}>
              <Controller
                name="roleId"
                control={control}
                render={({ field }) => (
                  <RoleSelector
                    label={t("form.role_label")}
                    defaultValue={field.value || undefined}
                    onSubmit={(value) => field.onChange(value?.id)}
                    error={!!errors.roleId?.message}
                    helperText={errors.roleId?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={12}>
              {isDirty && (
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  startIcon={<SaveTwoTone />}
                  loading={updateRoleMutation.isPending}
                >
                  {t("form.save_button")}
                </Button>
              )}
            </Grid>
          </Grid>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default EmployeeRoleCard;
