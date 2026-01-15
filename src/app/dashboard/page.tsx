import { Grid, Stack } from "@mui/material";
import BestSelling from "./components/BestSelling";
import DashboardController from "./components/DashboardController";
import { PaymentMethodTrafficChart } from "./components/PaymentMethodTrafficChart";
import { RecentOrders } from "./components/RecentOrders";
import Stats from "./components/Stats";
import { YearlySalesChart } from "./components/YearlySalesChart";

const Dashboard = async () => {
  return (
    <Stack spacing={1}>
      <Grid container spacing={1}>
        <Grid size={12}>
          <DashboardController />
        </Grid>
        <Grid size={12}>
          <Stats />
        </Grid>
        <Grid
          size={{
            xs: 12,
            xl: 8,
          }}
        >
          <YearlySalesChart />
        </Grid>
        <Grid
          size={{
            xs: 12,
            lg: 5,
            xl: 4,
          }}
        >
          <PaymentMethodTrafficChart />
        </Grid>
        <Grid
          size={{
            xs: 12,
            lg: 7,
            xl: 8,
          }}
        >
          <RecentOrders />
        </Grid>
        <Grid
          size={{
            xs: 12,
            lg: 5,
            xl: 4,
          }}
        >
          <BestSelling />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default Dashboard;
