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

const StatConfig: StatConfig[] = [
  {
    name: "orders",
    route: getRoute("histories"),
    label: "ขายไปแล้ว",
    icon: <Receipt />,
    render: (stats) => `${number(stats.order.sold)} รายการ`,
    color: "success",
  },
  {
    name: "consignments",
    route: getRoute("consignments"),
    label: "ฝากขาย",
    icon: <BackHand />,
    render: (stats) => `${number(stats.consignment)} รายการ`,
    color: "primary",
    permission: ConsignmentPermissionEnum.READ,
  },
  {
    name: "preorders",
    route: getRoute("preorders"),
    label: "พรีออเดอร์",
    icon: <RotateRight />,
    render: (stats) => `${number(stats.preorder.pending)} รายการ`,
    color: "info",
    permission: OverStockPermissionEnum.READ,
  },
  {
    name: "low_stock",
    route: getRoute("products"),
    label: "สินค้าใกล้จะหมด",
    icon: <Warning />,
    render: (stats) => `${number(stats.product.lowStockCount)} รายการ`,
    color: "warning",
    permission: ProductPermissionEnum.READ,
  },
];

const Stats = () => {
  const { user } = useAuth();
  if (!user) return notFound();
  const range = useAppSelector((state) => state.dashboard.range);

  const { isLoading, data } = useQuery({
    queryKey: ["stats", range],
    queryFn: () => getStats(range),
  });

  return (
    <Grid container spacing={1}>
      {StatConfig.map((stat) => (
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
