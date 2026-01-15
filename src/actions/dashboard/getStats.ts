"use server";
import { getUser } from "@/libs/session";
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

export const getStats = async (range: DashboardRange): Promise<StatResult> => {
  const summary = {
    order: { sold: 0 },
    preorder: { returned: 0, pending: 0 },
    consignment: 0,
    product: { lowStockCount: 0 },
  };

  const filterRange = await getDashboardRangeDate(range);
  console.log(filterRange);

  try {
    const user = await getUser();
    if (!user) throw new Error("not_found_user");

    const soldSummary = await getSoldSummary(user, filterRange);
    summary.order.sold = soldSummary.sold;

    const preorderSummary = await getPreOrderSummary(user, filterRange);
    summary.preorder = preorderSummary;
    summary.order.sold += preorderSummary.returned;

    const consignmentCount = await getConsignmentSummary(user, filterRange);
    summary.consignment = consignmentCount;

    const productSummary = await getProductSummary(user);
    summary.product = productSummary;

    return summary;
  } catch (e) {
    console.error(e);
    return summary;
  }
};
