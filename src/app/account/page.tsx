'use client';
import { Stack, Typography } from "@mui/material";
import React from "react";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import AccountInfo from "./components/AccountInfo";
import PasswordChanger from "./components/PasswordChanger";

const Account = () => {
  return (
    <Stack spacing={1}>
      <Stack direction="row" alignItems={"center"} spacing={3}>
        <Stack spacing={1} sx={{ flex: "1 1 auto" }}>
          <Typography variant="h4">บัญชี</Typography>
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: "center" }}
          ></Stack>
        </Stack>
      </Stack>
      <Grid container spacing={2}>
        <Grid xs={12} lg={12}>
          <AccountInfo />
        </Grid>
        <Grid xs={12} lg={12}>
          <PasswordChanger />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default Account;
