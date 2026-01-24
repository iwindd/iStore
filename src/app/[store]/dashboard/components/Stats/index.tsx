"use client";
import { getStats, StatResult } from "@/actions/dashboard/getStats";
import {
  ConsignmentPermissionEnum,
  OverStockPermissionEnum,
  PermissionEnum,
  ProductPermissionEnum,
} from "@/enums/permission";
import { useAppSelector } from "@/hooks";
import { useAuth } from "@/hooks/use-auth";
import { number } from "@/libs/formatter";
import { Route } from "@/libs/route/route";
import { getPath, getRoute } from "@/router";
import { BackHand, Receipt, RotateRight, Warning } from "@mui/icons-material";
import { Grid } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { notFound } from "next/navigation";
import { TotalStat, TotalStatProps } from "./Stat";

interface StatConfig {
  name: string;
  route?: Route;
  label: string;
  icon: React.ReactNode;
  render: (stats: StatResult) => string;
  color?: TotalStatProps["color"];
  permission?: PermissionEnum;
}

const Stats = () => {
  const t = useTranslations("DASHBOARD.stats");
  const { user } = useAuth();
  if (!user) return notFound();
  const range = useAppSelector((state) => state.dashboard.range);

  const { isLoading, data } = useQuery({
    queryKey: ["stats", range],
    queryFn: () => getStats(range),
  });

  const config: StatConfig[] = [
    {
      name: "orders",
      route: getRoute("store.histories"),
      label: t("sold"),
      icon: <Receipt />,
      render: (stats) => t("items_unit", { count: number(stats.order.sold) }),
      color: "success",
    },
    {
      name: "consignments",
      route: getRoute("store.consignments"),
      label: t("consignment"),
      icon: <BackHand />,
      render: (stats) => t("items_unit", { count: number(stats.consignment) }),
      color: "primary",
      permission: ConsignmentPermissionEnum.READ,
    },
    {
      name: "preorders",
      route: getRoute("store.preorders"),
      label: t("preorder"),
      icon: <RotateRight />,
      render: (stats) =>
        t("items_unit", { count: number(stats.preorder.pending) }),
      color: "info",
      permission: OverStockPermissionEnum.READ,
    },
    {
      name: "low_stock",
      route: getRoute("store.products"),
      label: t("low_stock"),
      icon: <Warning />,
      render: (stats) =>
        t("items_unit", { count: number(stats.product.lowStockCount) }),
      color: "warning",
      permission: ProductPermissionEnum.READ,
    },
  ];

  return (
    <Grid container>
      {config.map((stat) => (
        <Grid
          key={stat.name}
          size={{ xs: 12, sm: 6, lg: 3 }}
          display={
            stat.permission && !user.hasPermission(stat.permission)
              ? "none"
              : undefined
          }
        >
          <TotalStat
            href={stat.route && getPath(stat.route.name)}
            label={stat.label}
            color={stat.color || "primary"}
            icon={stat.icon}
            loading={isLoading}
            value={(data && stat.render(data)) || ""}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default Stats;
