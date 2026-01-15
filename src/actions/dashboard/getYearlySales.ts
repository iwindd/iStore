"use server";

import { getUser } from "@/libs/session";
import { notFound } from "next/navigation";
import { getYearlySalesData } from "./dashboard.helper";

export async function getYearlySales(year: number) {
  const user = await getUser();
  if (!user) return notFound();

  return await getYearlySalesData(user, year);
}
