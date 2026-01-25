"use server";

import { PermissionConfig } from "@/config/permissionConfig";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { DashboardRange } from "@/reducers/dashboardReducer";
import {
  getDashboardRangeDate,
  getTopSellingProductsData,
} from "./dashboard.helper";

export async function getTopSellingProducts(
  storeSlug: string,
  range: DashboardRange,
) {
  const ctx = await getPermissionContext(storeSlug);
  assertStoreCan(ctx, PermissionConfig.store.dashboard.viewBestSellingProducts);

  const rangeDate = await getDashboardRangeDate(range);
  return await getTopSellingProductsData(ctx, rangeDate);
}
