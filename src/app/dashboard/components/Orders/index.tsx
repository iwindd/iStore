"use client";
import { Grid } from "@mui/material";
import { RecentOrderTable } from "../../table/RecentOrders";
import BestSelling from "../BestSelling";

const Orders = () => {
  return (
    <Grid container spacing={1}>
      <Grid size={{ xs: 12, lg: 8 }}>
        <RecentOrderTable />
      </Grid>
      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <BestSelling />
      </Grid>
    </Grid>
  );
};

export default Orders;
