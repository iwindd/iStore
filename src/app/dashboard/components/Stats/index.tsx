"use client";
import { Path } from "@/config/Path";
import {
  BorrowPermissionEnum,
  DashboardPermissionEnum,
  OverStockPermissionEnum,
  PermissionEnum,
  ProductPermissionEnum,
  PurchasePermissionEnum,
  StockPermissionEnum,
} from "@/enums/permission";
import { useAppSelector } from "@/hooks";
import { useAuth } from "@/hooks/use-auth";
import { money, number } from "@/libs/formatter";
import { DashboardStateStatKey } from "@/reducers/dashboardReducer";
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
  path: { href: string; icon?: React.ReactNode } | null;
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
    path: Path("histories"),
    label: "ออเดอร์",
    icon: <Receipt />,
    render: (v) => `${number(v)} รายการ`,
    color: "primary",
  },
  {
    name: "profit",
    value: "profit",
    path: null,
    label: "เงินในระบบ",
    icon: <AttachMoney />,
    render: (v) => `${money(v)} รายการ`,
    color: "success",
    permission: DashboardPermissionEnum.READ,
  },
  {
    name: "borrows",
    value: "borrows",
    path: Path("borrows"),
    label: "การเบิก",
    icon: <BackHand />,
    render: (v) => `${number(v)} รายการ`,
    color: "warning",
    permission: BorrowPermissionEnum.READ,
  },
  {
    name: "purchase",
    value: "purchase",
    path: Path("purchase"),
    label: "การซื้อ",
    icon: <ShoppingBasket />,
    render: (v) => `${number(v)} รายการ`,
    color: "info",
    permission: PurchasePermissionEnum.READ,
  },
  {
    name: "overstocks",
    value: "overstock",
    path: Path("overstocks"),
    label: "สินค้าค้าง",
    icon: <RotateRight />,
    render: (v) => `${number(v)} รายการ`,
    color: "error",
    permission: OverStockPermissionEnum.READ,
  },
  {
    name: "low_stock",
    value: "low_stock",
    path: Path("products"),
    label: "สินค้าใกล้จะหมด",
    icon: <Warning />,
    render: (v) => `${number(v)} รายการ`,
    color: "warning",
    permission: ProductPermissionEnum.READ,
  },
  {
    name: "stocks",
    value: "stocks",
    path: Path("stock"),
    label: "จัดการสต๊อก",
    icon: <AllInbox />,
    render: (v) => `${number(v)} รายการ`,
    color: "info",
    permission: StockPermissionEnum.READ,
  },
  {
    name: "products",
    value: "products",
    path: Path("products"),
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
            href={stat.path ? stat.path.href : undefined}
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
