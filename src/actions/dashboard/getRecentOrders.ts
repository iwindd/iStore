"use server";

import { PermissionConfig } from "@/config/permissionConfig";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { getRecentOrdersData } from "./dashboard.helper";

export async function getRecentOrders(storeSlug: string) {
  const ctx = await getPermissionContext(storeSlug);
  assertStoreCan(ctx, PermissionConfig.store.dashboard.viewRecentOrders);

  return await getRecentOrdersData(ctx);
}
