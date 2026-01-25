"use server";

import { PermissionConfig } from "@/config/permissionConfig";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { getYearlySalesData } from "./dashboard.helper";

export async function getYearlySales(storeSlug: string, year: number) {
  const ctx = await getPermissionContext(storeSlug);
  assertStoreCan(ctx, PermissionConfig.store.dashboard.viewYearlySalesChart);

  return await getYearlySalesData(ctx, year);
}
