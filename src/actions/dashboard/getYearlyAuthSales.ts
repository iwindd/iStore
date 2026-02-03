"use server";

import { PermissionConfig } from "@/config/permissionConfig";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { getYearlyAuthSalesData } from "./dashboard.helper";

export async function getYearlyAuthSales(storeSlug: string, year: number) {
  const ctx = await getPermissionContext(storeSlug);
  assertStoreCan(
    ctx,
    PermissionConfig.store.dashboard.viewAuthYearlySalesChart,
  );

  return await getYearlyAuthSalesData(ctx, year);
}
