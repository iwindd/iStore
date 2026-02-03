"use server";
import { DashboardStatKey } from "@/config/Dashboard/StatConfig";
import { assertStore, PermissionContext } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import {
  DashboardRange,
  EnumDashboardRange,
} from "@/reducers/dashboardReducer";
import { unstable_cache } from "next/cache";
import {
  getActiveEventCount,
  getAuthSalesCount,
  getConsignmentSummary,
  getDashboardRangeDate,
  getPendingStockReceiptCount,
  getPreOrderSummary,
  getProductSummary,
  getSoldSummary,
  getStoreSalesCountToday,
  getTotalProductCount,
} from "./dashboard.helper";

export interface StatResult {
  order: { sold: number };
  preorder: { returned: number; pending: number };
  product: { lowStockCount: number };
  consignment: number;
  // New stats
  pendingStock: number;
  totalProducts: number;
  activePromotions: number;
  authSalesToday: number;
  authSalesTotal: number;
  storeSalesToday: number;
}

const getCachedStats = unstable_cache(
  async (
    ctx: PermissionContext,
    range: DashboardRange,
    statNames: DashboardStatKey[],
  ) => {
    const summary: StatResult = {
      order: { sold: 0 },
      preorder: { returned: 0, pending: 0 },
      consignment: 0,
      product: { lowStockCount: 0 },
      pendingStock: 0,
      totalProducts: 0,
      activePromotions: 0,
      authSalesToday: 0,
      authSalesTotal: 0,
      storeSalesToday: 0,
    };
    const startTime = Date.now();

    const filterRange = await getDashboardRangeDate(range);
    const todayRange = await getDashboardRangeDate({
      type: EnumDashboardRange.TODAY,
      start: "",
      end: "",
    });

    const statSet = new Set(statNames);

    try {
      if (statSet.has("orders")) {
        const soldSummary = await getSoldSummary(ctx, filterRange);
        summary.order.sold = soldSummary.sold;
      }

      if (statSet.has("preorders")) {
        const preorderSummary = await getPreOrderSummary(ctx, filterRange);
        summary.preorder = preorderSummary;
        summary.order.sold += preorderSummary.returned;
      }

      if (statSet.has("consignments"))
        summary.consignment = await getConsignmentSummary(ctx, filterRange);

      if (statSet.has("low_stock"))
        summary.product = await getProductSummary(ctx);

      if (statSet.has("pending_stock"))
        summary.pendingStock = await getPendingStockReceiptCount(ctx);

      if (statSet.has("total_products"))
        summary.totalProducts = await getTotalProductCount(ctx);

      if (statSet.has("active_promotions"))
        summary.activePromotions = await getActiveEventCount(ctx);

      if (statSet.has("auth_sales_today"))
        summary.authSalesToday = await getAuthSalesCount(ctx, todayRange);

      if (statSet.has("auth_sales_total"))
        summary.authSalesTotal = await getAuthSalesCount(ctx);

      if (statSet.has("store_sales_today"))
        summary.storeSalesToday = await getStoreSalesCountToday(ctx);

      return summary;
    } catch (e) {
      console.error(e);
      return summary;
    } finally {
      console.log(
        `Stats fetched in ${Date.now() - startTime}ms for range ${range.type}`,
      );
    }
  },
  ["my-app-user"],
);

export const getStats = async (
  storeSlug: string,
  range: DashboardRange,
  statNames: DashboardStatKey[],
): Promise<StatResult> => {
  const summary: StatResult = {
    order: { sold: 0 },
    preorder: { returned: 0, pending: 0 },
    consignment: 0,
    product: { lowStockCount: 0 },
    pendingStock: 0,
    totalProducts: 0,
    activePromotions: 0,
    authSalesToday: 0,
    authSalesTotal: 0,
    storeSalesToday: 0,
  };
  const startTime = Date.now();

  try {
    const ctx = await getPermissionContext(storeSlug);
    assertStore(ctx);

    return getCachedStats(ctx, range, statNames);
  } catch (e) {
    console.error(e);
    return summary;
  } finally {
    console.log(
      `Stats fetched in ${Date.now() - startTime}ms for range ${range.type}`,
    );
  }
};
