"use client";
import { useAppSelector } from "@/hooks";
import { Grid } from "@mui/material";
import BestSellerProducts from "../../table/BestSellerProducts";
import { RecentOrderTable } from "../../table/RecentOrders";

const Orders = () => {
  const bestSellers = useAppSelector((state) => state.dashboard.bestSellers);
  const orders = useAppSelector((state) => state.dashboard.orders);

  return (
    <Grid container spacing={1}>
      <Grid size={{ xs: 12, lg: 8 }}>
        <RecentOrderTable orders={orders} />
      </Grid>
      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <BestSellerProducts products={bestSellers} />
      </Grid>
    </Grid>
  );
};

export default Orders;
