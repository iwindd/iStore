"use client";
import { Grid } from "@mui/material";
import BestSelling from "../BestSelling";
import { RecentOrders } from "../BestSelling/RecentOrders";

const Orders = () => {
  return (
    <Grid container spacing={1}>
      <Grid size={{ xs: 12, lg: 8 }}>
        <RecentOrders />
      </Grid>
      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <BestSelling />
      </Grid>
    </Grid>
  );
};

export default Orders;
