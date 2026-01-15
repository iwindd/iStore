"use client";

import { useAppSelector } from "@/hooks";
import { Grid } from "@mui/material";
import { PaymentMethodTrafficChart } from "../../charts/PaymentMethodTrafficChart";
import { YearlySalesChart } from "../../charts/YearlySalesChart";

const Statistics = () => {
  const weeks = useAppSelector((state) => state.dashboard.statistics.weeks);
  const methods = useAppSelector((state) => state.dashboard.statistics.methods);

  return (
    <Grid container spacing={1}>
      <Grid size={{ xs: 12, lg: 8 }}>
        <YearlySalesChart />
      </Grid>
      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <PaymentMethodTrafficChart
          chartSeries={methods}
          labels={["เงินสด", "ธนาคาร"]}
        />
      </Grid>
    </Grid>
  );
};

export default Statistics;
