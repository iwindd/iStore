"use client";
import App, { Wrapper } from "@/layouts/App";
import Grid from "@mui/material/Grid";
import { useTranslations } from "next-intl";
import AccountInfo from "./components/AccountInfo";
import PasswordChanger from "./components/PasswordChanger";

const Account = () => {
  const t = useTranslations("ACCOUNT");

  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title>{t("title")}</App.Header.Title>
      </App.Header>
      <App.Main>
        <Grid container spacing={2}>
          <Grid size={12}>
            <AccountInfo />
          </Grid>
          <Grid size={12}>
            <PasswordChanger />
          </Grid>
        </Grid>
      </App.Main>
    </Wrapper>
  );
};

export default Account;
