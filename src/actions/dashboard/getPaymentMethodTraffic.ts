"use server";
import { PermissionConfig } from "@/config/permissionConfig";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { DashboardRange } from "@/reducers/dashboardReducer";
import { Method } from "@prisma/client";
import {
  getDashboardRangeDate,
  getPaymentMethodTrafficSummary,
} from "./dashboard.helper";

export const getPaymentMethodTraffic = async (
  storeId: string,
  range: DashboardRange,
) => {
  const summary: {
    method: Method;
    percent: number;
    count: number;
  }[] = [];

  try {
    const ctx = await getPermissionContext(storeId);

    const permissions =
      PermissionConfig.store.dashboard.viewPaymentMethodTraffic.some.map(
        (p) => p,
      );

    assertStoreCan(ctx, permissions, {
      some: true,
    });

    const filterRange = await getDashboardRangeDate(range);
    const summary = await getPaymentMethodTrafficSummary(ctx, filterRange);

    return summary;
  } catch (e) {
    console.error("getPaymentMethodTraffic error", e);
    return summary;
  }
};
