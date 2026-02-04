"use client";
import HasStorePermission from "@/components/Flagments/HasStorePermission";
import DASHBOARD_ANALYSIS_CONFIG, {
  getAutoVisibleAnalysis,
} from "@/config/Dashboard/AnalysisConfig";
import { PermissionConfig } from "@/config/permissionConfig";
import { useAppSelector } from "@/hooks";
import { RootState } from "@/libs/store";
import { usePermission } from "@/providers/PermissionProvider";
import { Grid } from "@mui/material";
import { useParams } from "next/navigation";
import { AuthYearlySalesChart } from "./AuthYealySalesChart";
import BestSelling from "./BestSelling";
import { PaymentMethodTrafficChart } from "./PaymentMethodTrafficChart";
import { RecentOrders } from "./RecentOrders";
import { YearlySalesChart } from "./YearlySalesChart";

const AnalysisCharts = () => {
  const params = useParams<{ store: string }>();
  const permission = usePermission();
  const storeSettings = useAppSelector(
    (state: RootState) => state.settings.stores[params.store],
  );

  const displayMode = storeSettings?.analysis?.displayMode ?? "auto";
  const visibility = storeSettings?.analysis?.visibility ?? {};

  const canAccessConfig = DASHBOARD_ANALYSIS_CONFIG.filter((chart) =>
    "permission" in chart
      ? permission.hasStorePermission(
          Array.isArray(chart.permission)
            ? chart.permission.map((p) => p)
            : [chart.permission],
          true,
        )
      : true,
  );

  // Filter charts based on display mode
  const visibleCharts =
    displayMode === "custom"
      ? canAccessConfig.filter((chart) => visibility[chart.name] ?? true)
      : getAutoVisibleAnalysis(canAccessConfig);

  const isChartVisible = (name: string) =>
    visibleCharts.some((chart) => chart.name === name);

  return (
    <Grid container>
      {/* STORE YEARLY SALES */}
      {isChartVisible("yearly_sales") && (
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
      )}

      {/* STORE AUTH YEARLY SALES */}
      {isChartVisible("auth_yearly_sales") && (
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
      )}

      {/* STORE PAYMENT METHOD TRAFFIC */}
      {isChartVisible("payment_method_traffic") && (
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
      )}

      {/* STORE RECENT ORDERS */}
      {isChartVisible("recent_orders") && (
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
      )}

      {/* STORE BEST SELLING PRODUCTS */}
      {isChartVisible("best_selling") && (
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
      )}
    </Grid>
  );
};

export default AnalysisCharts;
