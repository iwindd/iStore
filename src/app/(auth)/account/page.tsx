"use client";
import App, { Wrapper } from "@/layouts/App";
import Grid from "@mui/material/Unstable_Grid2";
import AccountInfo from "./components/AccountInfo";
import PasswordChanger from "./components/PasswordChanger";

const Account = () => {
  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title>บัญชี</App.Header.Title>
      </App.Header>
      <App.Main>
        <Grid container spacing={2}>
          <Grid xs={12} lg={12}>
            <AccountInfo />
          </Grid>
          <Grid xs={12} lg={12}>
            <PasswordChanger />
          </Grid>
        </Grid>
      </App.Main>
    </Wrapper>
  );
};

export default Account;
