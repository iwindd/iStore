"use client";
import App, { Wrapper } from "@/layouts/App";
import { AddTwoTone } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import RoleDatatable from "./components/datatable";

const RolePage = () => {
  const t = useTranslations("ROLES");
  const router = useRouter();
  const params = useParams();
  const storeSlug = params.store as string;

  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title subtitle={t("description")}>
          {t("title")}
        </App.Header.Title>
        <App.Header.Actions>
          <Button
            startIcon={<AddTwoTone />}
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => router.push(`/projects/${storeSlug}/roles/new`)}
          >
            {t("add_button")}
          </Button>
        </App.Header.Actions>
      </App.Header>
      <App.Main>
        <RoleDatatable />
      </App.Main>
    </Wrapper>
  );
};

export default RolePage;
