import { PermissionConfig } from "@/config/permissionConfig";

export interface DashboardAnalysisConfig {
  name: string;
  label: string;
  permission?: string | readonly string[];
  priority: AnalysisPriority;
  type: AnalysisType;
}

enum AnalysisType {
  CHART = "chart",
  WIDGET = "widget",
  LIST = "list",
}

enum AnalysisPriority {
  Highest = 0,
  High = 1,
  Medium = 2,
  Low = 3,
  Lowest = 4,
}

const DASHBOARD_ANALYSIS_CONFIG = [
  {
    name: "yearly_sales",
    label: "yearly_sales",
    permission: PermissionConfig.store.dashboard.viewYearlySalesChart,
    type: AnalysisType.CHART,
    priority: AnalysisPriority.Highest,
  },
  {
    name: "auth_yearly_sales",
    label: "auth_yearly_sales",
    permission: PermissionConfig.store.dashboard.viewAuthYearlySalesChart,
    type: AnalysisType.CHART,
    priority: AnalysisPriority.High,
  },
  {
    name: "payment_method_traffic",
    label: "payment_method_traffic",
    permission: PermissionConfig.store.dashboard.viewPaymentMethodTraffic.some,
    type: AnalysisType.WIDGET,
    priority: AnalysisPriority.Medium,
  },
  {
    name: "best_selling",
    label: "best_selling",
    permission: PermissionConfig.store.dashboard.viewBestSellingProducts,
    type: AnalysisType.LIST,
    priority: AnalysisPriority.Medium,
  },
  {
    name: "recent_orders",
    label: "recent_orders",
    permission: PermissionConfig.store.dashboard.viewRecentOrders,
    type: AnalysisType.LIST,
    priority: AnalysisPriority.Medium,
  },
] as const satisfies readonly DashboardAnalysisConfig[];

export type DashboardAnalysisKey =
  (typeof DASHBOARD_ANALYSIS_CONFIG)[number]["name"];

const DEFAULT_VISIBLE_ANALYSIS = {
  CHART: 1,
  WIDGET: 1,
  LIST: 2,
};

const TYPE_LIMIT_MAP: Record<AnalysisType, number> = {
  chart: DEFAULT_VISIBLE_ANALYSIS.CHART,
  widget: DEFAULT_VISIBLE_ANALYSIS.WIDGET,
  list: DEFAULT_VISIBLE_ANALYSIS.LIST,
};

export const DEFAULT_DASHBOARD_ANALYSIS_VISIBILITY = (() => {
  const visibility = Object.fromEntries(
    DASHBOARD_ANALYSIS_CONFIG.map((item) => [item.name, false]),
  ) as Record<DashboardAnalysisKey, boolean>;

  const grouped = DASHBOARD_ANALYSIS_CONFIG.reduce(
    (acc, item) => {
      acc[item.type].push(item);
      return acc;
    },
    {
      chart: [],
      widget: [],
      list: [],
    } as Record<AnalysisType, (typeof DASHBOARD_ANALYSIS_CONFIG)[number][]>,
  );

  (Object.keys(grouped) as AnalysisType[]).forEach((type) => {
    grouped[type]
      .sort((a, b) => a.priority - b.priority) // เลขน้อย = สำคัญกว่า
      .slice(0, TYPE_LIMIT_MAP[type])
      .forEach((item) => {
        visibility[item.name] = true;
      });
  });

  return visibility;
})();

export const getAutoVisibleAnalysis = (
  canAccessCharts: DashboardAnalysisConfig[],
): DashboardAnalysisConfig[] => {
  const visibility = Object.fromEntries(
    canAccessCharts.map((item) => [item.name, false]),
  ) as Record<DashboardAnalysisKey, boolean>;

  const grouped = canAccessCharts.reduce(
    (acc, item) => {
      acc[item.type].push(item);
      return acc;
    },
    {
      chart: [],
      widget: [],
      list: [],
    } as Record<AnalysisType, (typeof canAccessCharts)[number][]>,
  );

  (Object.keys(grouped) as AnalysisType[]).forEach((type) => {
    grouped[type]
      .sort((a, b) => a.priority - b.priority) // เลขน้อย = สำคัญกว่า
      .slice(0, TYPE_LIMIT_MAP[type])
      .forEach((item) => {
        visibility[item.name as DashboardAnalysisKey] = true;
      });
  });

  return canAccessCharts.filter(
    (item) => visibility[item.name as DashboardAnalysisKey],
  );
};

export default DASHBOARD_ANALYSIS_CONFIG;
