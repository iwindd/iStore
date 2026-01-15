"use server";
import { getUser } from "@/libs/session";
import { DashboardRange } from "@/reducers/dashboardReducer";
import { Method } from "@prisma/client";
import {
  getDashboardRangeDate,
  getPaymentMethodTrafficSummary,
} from "./dashboard.helper";

export const getPaymentMethodTraffic = async (range: DashboardRange) => {
  const summary: {
    method: Method;
    percent: number;
    count: number;
  }[] = [];

  try {
    const user = await getUser();
    if (!user) throw new Error("not_found_user");

    const filterRange = await getDashboardRangeDate(range);
    const summary = await getPaymentMethodTrafficSummary(user, filterRange);

    return summary;
  } catch (e) {
    console.error("getPaymentMethodTraffic error", e);
    return summary;
  }
};
