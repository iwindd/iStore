"use client";
import {
  BorrowPermissionEnum,
  OverStockPermissionEnum,
  PermissionEnum,
  ProductPermissionEnum,
  PurchasePermissionEnum,
  StockPermissionEnum,
} from "@/enums/permission";
import { useAppSelector } from "@/hooks";
import { useAuth } from "@/hooks/use-auth";
import { money, number } from "@/libs/formatter";
import { Route } from "@/libs/route/route";
import { DashboardStateStatKey } from "@/reducers/dashboardReducer";
import { getPath, getRoute } from "@/router";
import {
  AllInbox,
  AttachMoney,
  BackHand,
  Receipt,
  RotateRight,
  ShoppingBasket,
  Warning,
  Work,
} from "@mui/icons-material";
import { Grid } from "@mui/material";
import { notFound } from "next/navigation";
import { TotalStat, TotalStatProps } from "./Stat";

interface StatConfig {
  name: string;
  value: DashboardStateStatKey;
  route?: Route;
  label: string;
  icon: React.ReactNode;
  render: (value: number) => string;
  color?: TotalStatProps["color"];
  permission?: PermissionEnum;
}

const StatConfig: StatConfig[] = [
  {
    name: "orders",
    value: "orders",
    route: getRoute("histories"),
    label: "ออเดอร์",
    icon: <Receipt />,
    render: (v) => `${number(v)} รายการ`,
    color: "primary",
  },
  {
    name: "profit",
    value: "profit",
    label: "เงินในระบบ",
    icon: <AttachMoney />,
    render: (v) => `${money(v)} รายการ`,
    color: "success",
  },
  {
    name: "borrows",
    value: "borrows",
    route: getRoute("borrows"),
    label: "การเบิก",
    icon: <BackHand />,
    render: (v) => `${number(v)} รายการ`,
    color: "warning",
    permission: BorrowPermissionEnum.READ,
  },
  {
    name: "purchase",
    value: "purchase",
    route: getRoute("purchase"),
    label: "การซื้อ",
    icon: <ShoppingBasket />,
    render: (v) => `${number(v)} รายการ`,
    color: "info",
    permission: PurchasePermissionEnum.READ,
  },
  {
    name: "overstocks",
    value: "overstock",
    route: getRoute("overstocks"),
    label: "สินค้าค้าง",
    icon: <RotateRight />,
    render: (v) => `${number(v)} รายการ`,
    color: "error",
    permission: OverStockPermissionEnum.READ,
  },
  {
    name: "low_stock",
    value: "low_stock",
    route: getRoute("products"),
    label: "สินค้าใกล้จะหมด",
    icon: <Warning />,
    render: (v) => `${number(v)} รายการ`,
    color: "warning",
    permission: ProductPermissionEnum.READ,
  },
  {
    name: "stocks",
    value: "stocks",
    route: getRoute("stocks"),
    label: "จัดการสต๊อก",
    icon: <AllInbox />,
    render: (v) => `${number(v)} รายการ`,
    color: "info",
    permission: StockPermissionEnum.READ,
  },
  {
    name: "products",
    value: "products",
    route: getRoute("products"),
    label: "สินค้าทั้งหมด",
    icon: <Work />,
    render: (v) => `${number(v)} รายการ`,
    permission: ProductPermissionEnum.READ,
  },
];

const Stats = () => {
  const { user } = useAuth();
  if (!user) return notFound();
  const stats = useAppSelector((state) => state.dashboard.stats);

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
            value={stat.render(stats[stat.value])}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default Stats;
