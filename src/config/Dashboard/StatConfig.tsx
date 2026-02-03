import { TotalStatProps } from "@/app/projects/[store]/dashboard/components/Stats/Stat";
import { PermissionConfig } from "@/config/permissionConfig";
import { Route } from "@/libs/route/route";
import { getRoute } from "@/router";
import {
  BackHand,
  Category,
  Inventory,
  LocalOffer,
  Person,
  Receipt,
  RotateRight,
  Storefront,
  Today,
  Warning,
} from "@mui/icons-material";

export interface DashboardStatConfig {
  name: string;
  href?: Route;
  label: string;
  icon: React.ReactNode;
  color?: TotalStatProps["color"];
  permission?: string;
  priority?: StatPriority;
}

enum StatPriority {
  High = 1,
  Medium = 2,
  Low = 3,
}

const DASHBOARD_STATS_CONFIG = [
  {
    name: "orders",
    href: getRoute("projects.store.histories"),
    label: "sold",
    icon: <Receipt />,
    color: "success",
    permission: PermissionConfig.store.dashboard.viewOrderSoldStat,
    priority: StatPriority.Low,
  },
  {
    name: "consignments",
    href: getRoute("projects.store.consignments"),
    label: "consignment",
    icon: <BackHand />,
    color: "primary",
    permission: PermissionConfig.store.dashboard.viewConsignmentStat,
    priority: StatPriority.High,
  },
  {
    name: "preorders",
    href: getRoute("projects.store.preorders"),
    label: "preorder",
    icon: <RotateRight />,
    color: "info",
    permission: PermissionConfig.store.dashboard.viewPreorderStat,
    priority: StatPriority.High,
  },
  {
    name: "low_stock",
    href: getRoute("projects.store.products"),
    label: "low_stock",
    icon: <Warning />,
    color: "warning",
    permission: PermissionConfig.store.dashboard.viewLowstockStat,
    priority: StatPriority.High,
  },
  // New stats
  {
    name: "pending_stock",
    href: getRoute("projects.store.stocks"),
    label: "pending_stock",
    icon: <Inventory />,
    color: "secondary",
    permission: PermissionConfig.store.stock.getReceiptDatatable,
    priority: StatPriority.Medium,
  },
  {
    name: "total_products",
    href: getRoute("projects.store.products"),
    label: "total_products",
    icon: <Category />,
    color: "primary",
    permission: PermissionConfig.store.product.getDatatable,
    priority: StatPriority.Low,
  },
  {
    name: "active_promotions",
    href: getRoute("projects.store.promotions"),
    label: "active_promotions",
    icon: <LocalOffer />,
    color: "error",
    permission: PermissionConfig.store.promotion.getDatatable,
    priority: StatPriority.High,
  },
  {
    name: "auth_sales_today",
    label: "auth_sales_today",
    icon: <Today />,
    color: "info",
    priority: StatPriority.Low,
  },
  {
    name: "auth_sales_total",
    label: "auth_sales_total",
    icon: <Person />,
    color: "success",
    priority: StatPriority.Low,
  },
  {
    name: "store_sales_today",
    href: getRoute("projects.store.histories"),
    label: "store_sales_today",
    icon: <Storefront />,
    color: "primary",
    permission: PermissionConfig.store.dashboard.viewOrderSoldStat,
    priority: StatPriority.Low,
  },
] as const satisfies readonly DashboardStatConfig[];

export type DashboardStatKey = (typeof DASHBOARD_STATS_CONFIG)[number]["name"];

export const DEFAULT_DASHBOARD_STATS_VISIBILITY = DASHBOARD_STATS_CONFIG.reduce(
  (acc, stat) => {
    acc[stat.name] = true;
    return acc;
  },
  {} as Record<string, boolean>,
) as Record<DashboardStatKey, boolean>;

export default DASHBOARD_STATS_CONFIG;
