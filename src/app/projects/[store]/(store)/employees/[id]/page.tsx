"use client";

import App, { Wrapper } from "@/layouts/App";
import { Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import EmployeeRoleCard from "./components/EmployeeRoleCard";
import UserInfoCard from "./components/UserInfoCard";
import { useEmployee } from "./providers/EmployeeProvider";

const EditEmployeePage = () => {
  const t = useTranslations("EMPLOYEES");
  const { employee, storeSlug } = useEmployee();

  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title>{t("edit_title")}</App.Header.Title>
      </App.Header>
      <App.Main>
        <Stack spacing={3}>
          <UserInfoCard user={employee.user} />
          <EmployeeRoleCard employee={employee} storeSlug={storeSlug} />
        </Stack>
      </App.Main>
    </Wrapper>
  );
};

export default EditEmployeePage;
