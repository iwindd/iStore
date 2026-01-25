"use server";
import { assertStore } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { DashboardRange } from "@/reducers/dashboardReducer";
import {
  getConsignmentSummary,
  getDashboardRangeDate,
  getPreOrderSummary,
  getProductSummary,
  getSoldSummary,
} from "./dashboard.helper";

export interface StatResult {
  order: { sold: number };
  preorder: { returned: number; pending: number };
  product: { lowStockCount: number };
  consignment: number;
}

export const getStats = async (
  storeSlug: string,
  range: DashboardRange,
): Promise<StatResult> => {
  const summary = {
    order: { sold: 0 },
    preorder: { returned: 0, pending: 0 },
    consignment: 0,
    product: { lowStockCount: 0 },
  };

  const filterRange = await getDashboardRangeDate(range);

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

    return summary;
  } catch (e) {
    console.error(e);
    return summary;
  }
};
