"use client";
import { useAppSelector } from "@/hooks";
import { Grid } from "@mui/material";
import { RecentOrderTable } from "../../table/RecentOrders";
import BestSelling from "../BestSelling";

const Orders = () => {
  const orders = useAppSelector((state) => state.dashboard.orders);

  return (
    <Grid container spacing={1}>
      <Grid size={{ xs: 12, lg: 8 }}>
        <RecentOrderTable orders={orders} />
      </Grid>
      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <BestSelling />
      </Grid>
    </Grid>
  );
};

export default Orders;
