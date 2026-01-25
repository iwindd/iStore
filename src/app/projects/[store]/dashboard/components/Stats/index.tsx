"use client";
import { getStats, StatResult } from "@/actions/dashboard/getStats";
import HasStorePermission from "@/components/Flagments/HasStorePermission";
import { PermissionConfig } from "@/config/permissionConfig";
import { useAppSelector } from "@/hooks";
import { useAuth } from "@/hooks/use-auth";
import { number } from "@/libs/formatter";
import { Route } from "@/libs/route/route";
import { getPath, getRoute } from "@/router";
import { BackHand, Receipt, RotateRight, Warning } from "@mui/icons-material";
import { Grid } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { notFound, useParams } from "next/navigation";
import { TotalStat, TotalStatProps } from "./Stat";

interface StatConfig {
  name: string;
  route?: Route;
  label: string;
  icon: React.ReactNode;
  render: (stats: StatResult) => string;
  color?: TotalStatProps["color"];
  permission?: string;
}

const Stats = () => {
  const t = useTranslations("DASHBOARD.stats");
  const { user } = useAuth();
  if (!user) return notFound();
  const range = useAppSelector((state) => state.dashboard.range);
  const params = useParams<{ store: string }>();

  const { isLoading, data } = useQuery({
    queryKey: ["stats", range],
    queryFn: () => getStats(params.store, range),
  });

  const config: StatConfig[] = [
    {
      name: "orders",
      route: getRoute("projects.store.histories"),
      label: t("sold"),
      icon: <Receipt />,
      render: (stats) => t("items_unit", { count: number(stats.order.sold) }),
      color: "success",
      permission: PermissionConfig.store.dashboard.viewOrderSoldStat,
    },
    {
      name: "consignments",
      route: getRoute("projects.store.consignments"),
      label: t("consignment"),
      icon: <BackHand />,
      render: (stats) => t("items_unit", { count: number(stats.consignment) }),
      color: "primary",
      permission: PermissionConfig.store.dashboard.viewConsignmentStat,
    },
    {
      name: "preorders",
      route: getRoute("projects.store.preorders"),
      label: t("preorder"),
      icon: <RotateRight />,
      render: (stats) =>
        t("items_unit", { count: number(stats.preorder.pending) }),
      color: "info",
      permission: PermissionConfig.store.dashboard.viewPreorderStat,
    },
    {
      name: "low_stock",
      route: getRoute("projects.store.products"),
      label: t("low_stock"),
      icon: <Warning />,
      render: (stats) =>
        t("items_unit", { count: number(stats.product.lowStockCount) }),
      color: "warning",
      permission: PermissionConfig.store.dashboard.viewLowstockStat,
    },
  ];

  return (
    <Grid container>
      {config.map((stat) => (
        <HasStorePermission key={stat.name} permission={stat.permission || []}>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <TotalStat
              href={stat.route && getPath(stat.route.name)}
              label={stat.label}
              color={stat.color || "primary"}
              icon={stat.icon}
              loading={isLoading}
              value={(data && stat.render(data)) || ""}
            />
          </Grid>
        </HasStorePermission>
      ))}
    </Grid>
  );
};

export default Stats;
