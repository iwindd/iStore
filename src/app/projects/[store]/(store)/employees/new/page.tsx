"use client";

import createStoreEmployee from "@/actions/employee/createStoreEmployee";
import App, { Wrapper } from "@/layouts/App";
import { getPath } from "@/router";
import { EmployeeValues } from "@/schema/Employee";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import EmployeeForm from "../components/EmployeeForm";

const NewEmployeePage = () => {
  const t = useTranslations("EMPLOYEES");
  const params = useParams();
  const storeSlug = params.store as string;
  const router = useRouter();

  const createEmployeeMutation = useMutation({
    mutationFn: (values: EmployeeValues) =>
      createStoreEmployee(storeSlug, values),
    onSuccess: (data) => {
      enqueueSnackbar(t("messages.created"), { variant: "success" });
      router.push(
        getPath("projects.store.employees.employee", {
          employeeId: data.id.toString(),
        }),
      );
    },
    onError: (error) => {
      console.error(error);
      enqueueSnackbar(t("messages.error"), { variant: "error" });
    },
  });

  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title>{t("create_title")}</App.Header.Title>
      </App.Header>
      <App.Main>
        <EmployeeForm
          storeSlug={storeSlug}
          onSubmit={createEmployeeMutation.mutate}
          isSubmitting={createEmployeeMutation.isPending}
        />
      </App.Main>
    </Wrapper>
  );
};

export default NewEmployeePage;
