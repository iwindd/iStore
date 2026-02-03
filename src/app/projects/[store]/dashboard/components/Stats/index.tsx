"use client";
import { getStats } from "@/actions/dashboard/getStats";
import HasStorePermission from "@/components/Flagments/HasStorePermission";
import DASHBOARD_STATS_CONFIG, {
  DashboardStatConfig,
  DashboardStatKey,
} from "@/config/Dashboard/StatConfig";
import { useAppSelector } from "@/hooks";
import { useAuth } from "@/hooks/use-auth";
import { useRoute } from "@/hooks/use-route";
import { RootState } from "@/libs/store";
import { Grid } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useFormatter, useTranslations } from "next-intl";
import { notFound, useParams } from "next/navigation";
import { TotalStat } from "./Stat";

const Stats = () => {
  const t = useTranslations("DASHBOARD.stats");
  const { number } = useFormatter();
  const params = useParams<{ store: string }>();
  const { user } = useAuth();
  const range = useAppSelector((state) => state.dashboard.range);
  const storeSettings = useAppSelector(
    (state: RootState) => state.settings.stores[params.store],
  );
  const route = useRoute();

  if (!user) return notFound();

  const config = DASHBOARD_STATS_CONFIG;
  // Filter stats based on display mode and visibility settings
  const displayMode = storeSettings?.stats?.displayMode ?? "auto";
  const visibility = storeSettings?.stats?.visibility ?? {};
  const filteredConfig =
    displayMode === "custom"
      ? config.filter((stat) => visibility[stat.name] ?? true)
      : config
          .toSorted((a, b) => (a.priority ?? 0) - (b.priority ?? 0))
          .slice(0, 4);

  console.log(filteredConfig);
  const filteredConfigNames = filteredConfig.map((s) => s.name);

  const { isLoading, data } = useQuery({
    queryKey: ["stats", range, filteredConfigNames.join(",")],
    queryFn: () => getStats(params.store, range, filteredConfigNames),
  });

  const renderStat = (stat: DashboardStatConfig) => {
    if (!data) return "";

    switch (stat.name as DashboardStatKey) {
      case "orders":
        return t("items_unit", { count: number(data?.order.sold) });
      case "consignments":
        return t("items_unit", { count: number(data?.consignment) });
      case "preorders":
        return t("items_unit", { count: number(data?.preorder.pending) });
      case "low_stock":
        return t("items_unit", { count: number(data?.product.lowStockCount) });
      case "pending_stock":
        return t("items_unit", { count: number(data?.pendingStock) });
      case "total_products":
        return t("items_unit", { count: number(data?.totalProducts) });
      case "active_promotions":
        return t("items_unit", { count: number(data?.activePromotions) });
      case "auth_sales_today":
        return t("items_unit", { count: number(data?.authSalesToday) });
      case "auth_sales_total":
        return t("items_unit", { count: number(data?.authSalesTotal) });
      case "store_sales_today":
        return t("items_unit", { count: number(data?.storeSalesToday) });
      default:
        return "Unknown";
    }
  };

  const getHref = (stat: DashboardStatConfig) => {
    if (!("href" in stat)) return undefined;
    if (!stat.href?.name) return undefined;
    return route.path(stat.href.name, { store: params.store });
  };

  return (
    <Grid container>
      {filteredConfig.map((stat) => (
        <HasStorePermission
          key={stat.name}
          permission={"permission" in stat ? stat.permission : []}
        >
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <TotalStat
              href={getHref(stat)}
              label={t(stat.label)}
              color={stat.color || "primary"}
              icon={stat.icon}
              loading={isLoading}
              value={renderStat(stat)}
            />
          </Grid>
        </HasStorePermission>
      ))}
    </Grid>
  );
};

export default Stats;
