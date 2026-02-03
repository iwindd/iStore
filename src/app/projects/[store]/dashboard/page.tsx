import HasStorePermission from "@/components/Flagments/HasStorePermission";
import { PermissionConfig } from "@/config/permissionConfig";
import { Grid } from "@mui/material";
import { AuthYearlySalesChart } from "./components/Analysis/AuthYealySalesChart";
import BestSelling from "./components/Analysis/BestSelling";
import { PaymentMethodTrafficChart } from "./components/Analysis/PaymentMethodTrafficChart";
import { RecentOrders } from "./components/Analysis/RecentOrders";
import { YearlySalesChart } from "./components/Analysis/YearlySalesChart";
import DashboardController from "./components/DashboardController";
import Stats from "./components/Stats";

const Dashboard = () => {
  return (
    <Grid container>
      <Grid size={12}>
        <DashboardController />
      </Grid>
      <Grid size={12}>
        <Stats />
      </Grid>
      {/* STORE YEARLY SALES */}
      <HasStorePermission
        permission={PermissionConfig.store.dashboard.viewYearlySalesChart}
      >
        <Grid
          size={{
            xs: 12,
            xl: 8,
          }}
        >
          <YearlySalesChart />
        </Grid>
      </HasStorePermission>
      {/* STORE AUTH YEARLY SALES */}
      <HasStorePermission
        permission={PermissionConfig.store.dashboard.viewAuthYearlySalesChart}
      >
        <Grid
          size={{
            xs: 12,
            xl: 8,
          }}
        >
          <AuthYearlySalesChart />
        </Grid>
      </HasStorePermission>
      {/* STORE PAYMENT METHOD TRAFFIC */}
      <HasStorePermission
        permission={PermissionConfig.store.dashboard.viewPaymentMethodTraffic.some.map(
          (p) => p,
        )}
        some
      >
        <Grid
          size={{
            xs: 12,
            lg: 5,
            xl: 4,
          }}
        >
          <PaymentMethodTrafficChart />
        </Grid>
      </HasStorePermission>

      {/* STORE RECENT ORDERS */}
      <HasStorePermission
        permission={PermissionConfig.store.dashboard.viewRecentOrders}
      >
        <Grid
          size={{
            xs: 12,
            lg: 7,
            xl: 8,
          }}
        >
          <RecentOrders />
        </Grid>
      </HasStorePermission>
      {/* STORE BEST SELLING PRODUCTS */}
      <HasStorePermission
        permission={PermissionConfig.store.dashboard.viewBestSellingProducts}
      >
        <Grid
          size={{
            xs: 12,
            lg: 5,
            xl: 4,
          }}
        >
          <BestSelling />
        </Grid>
      </HasStorePermission>
    </Grid>
  );
};

export default Dashboard;
