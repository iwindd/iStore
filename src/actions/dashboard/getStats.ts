"use server";
import { assertStore } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import {
  DashboardRange,
  EnumDashboardRange,
} from "@/reducers/dashboardReducer";
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

export const getStats = async (
  storeSlug: string,
  range: DashboardRange,
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

  const filterRange = await getDashboardRangeDate(range);
  const todayRange = await getDashboardRangeDate({
    type: EnumDashboardRange.TODAY,
    start: "",
    end: "",
  });

  try {
    const ctx = await getPermissionContext(storeSlug);
    assertStore(ctx);

    const soldSummary = await getSoldSummary(ctx, filterRange);
    summary.order.sold = soldSummary.sold;

    const preorderSummary = await getPreOrderSummary(ctx, filterRange);
    summary.preorder = preorderSummary;
    summary.order.sold += preorderSummary.returned;

    const consignmentCount = await getConsignmentSummary(ctx, filterRange);
    summary.consignment = consignmentCount;

    const productSummary = await getProductSummary(ctx);
    summary.product = productSummary;

    // New stats
    summary.pendingStock = await getPendingStockReceiptCount(ctx);
    summary.totalProducts = await getTotalProductCount(ctx);
    summary.activePromotions = await getActiveEventCount(ctx);
    summary.authSalesToday = await getAuthSalesCount(ctx, todayRange);
    summary.authSalesTotal = await getAuthSalesCount(ctx);
    summary.storeSalesToday = await getStoreSalesCountToday(ctx);

    return summary;
  } catch (e) {
    console.error(e);
    return summary;
  }
};
