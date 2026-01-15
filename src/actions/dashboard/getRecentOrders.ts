"use server";

import { getUser } from "@/libs/session";
import { notFound } from "next/navigation";
import { getRecentOrdersData } from "./dashboard.helper";

export async function getRecentOrders() {
  const user = await getUser();
  if (!user) return notFound();

  return await getRecentOrdersData(user);
}
