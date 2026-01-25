"use client";

import updateStoreEmployee from "@/actions/employee/updateStoreEmployee";
import App, { Wrapper } from "@/layouts/App";
import { EmployeeValues } from "@/schema/Employee";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { enqueueSnackbar } from "notistack";
import EmployeeForm from "../components/EmployeeForm";
import { useEmployee } from "./providers/EmployeeProvider";

const EditEmployeePage = () => {
  const t = useTranslations("EMPLOYEES");
  const { employee, storeSlug } = useEmployee();

  const updateEmployeeMutation = useMutation({
    mutationFn: (values: EmployeeValues) =>
      updateStoreEmployee(storeSlug, { ...values, id: employee.id }),
    onSuccess: () => {
      enqueueSnackbar(t("messages.updated"), { variant: "success" });
    },
    onError: (error) => {
      console.error(error);
      enqueueSnackbar(t("messages.error"), { variant: "error" });
    },
  });

  const initialValues: Partial<EmployeeValues> = {
    firstName: employee.user.first_name,
    lastName: employee.user.last_name,
    email: employee.user.email,
    password: "", // Don't show existing password
    roleId: employee.role_id,
  };

  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title>{t("edit_title")}</App.Header.Title>
      </App.Header>
      <App.Main>
        <EmployeeForm
          storeSlug={storeSlug}
          initialValues={initialValues}
          onSubmit={updateEmployeeMutation.mutate}
          isSubmitting={updateEmployeeMutation.isPending}
        />
      </App.Main>
    </Wrapper>
  );
};

export default EditEmployeePage;
