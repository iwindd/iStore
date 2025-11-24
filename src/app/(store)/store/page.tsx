"use client";
import App, { Wrapper } from "@/layouts/App";
import Grid from "@mui/material/Grid";
import LineBotPartial from "./components/LineBot";

const StoreSettingPage = () => {
  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title>ร้านค้า</App.Header.Title>
      </App.Header>
      <App.Main>
        <Grid container spacing={2}>
          <Grid size={12}>
            <LineBotPartial />
          </Grid>
        </Grid>
      </App.Main>
    </Wrapper>
  );
};

export default StoreSettingPage;
