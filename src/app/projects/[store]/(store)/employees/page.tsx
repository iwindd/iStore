"use client";
import App, { Wrapper } from "@/layouts/App";
import { AddTwoTone } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import EmployeeDatatable from "./components/datatable";

const EmployeePage = () => {
  const t = useTranslations("EMPLOYEES");
  const router = useRouter();
  const params = useParams();
  const storeSlug = params.store as string;

  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title>{t("title")}</App.Header.Title>
        <App.Header.Actions>
          <Button
            startIcon={<AddTwoTone />}
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => router.push(`/projects/${storeSlug}/employees/new`)}
          >
            {t("add_button")}
          </Button>
        </App.Header.Actions>
      </App.Header>
      <App.Main>
        <EmployeeDatatable />
      </App.Main>
    </Wrapper>
  );
};

export default EmployeePage;
