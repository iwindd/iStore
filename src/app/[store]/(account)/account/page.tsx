"use client";
import FormAccountInfo from "@/components/Forms/Account/FormAccountInfo";
import FormPasswordChange from "@/components/Forms/Account/FormPasswordChange";
import App, { Wrapper } from "@/layouts/App";
import Grid from "@mui/material/Grid";
import { useTranslations } from "next-intl";

const AccountPage = () => {
  const t = useTranslations("ACCOUNT");

  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title>{t("title")}</App.Header.Title>
      </App.Header>
      <App.Main>
        <Grid container spacing={2}>
          <Grid size={12}>
            <FormAccountInfo />
          </Grid>
          <Grid size={12}>
            <FormPasswordChange />
          </Grid>
        </Grid>
      </App.Main>
    </Wrapper>
  );
};

export default AccountPage;
