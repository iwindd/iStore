"use server";

import { getUser } from "@/libs/session";
import { DashboardRange } from "@/reducers/dashboardReducer";
import { notFound } from "next/navigation";
import {
  getDashboardRangeDate,
  getTopSellingProductsData,
} from "./dashboard.helper";

export async function getTopSellingProducts(range: DashboardRange) {
  const user = await getUser();
  if (!user) return notFound();

  const rangeDate = await getDashboardRangeDate(range);
  return await getTopSellingProductsData(user, rangeDate);
}
