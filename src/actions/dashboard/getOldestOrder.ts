"use server";

import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { notFound } from "next/navigation";

export async function getOldestOrder() {
  const user = await getUser();
  if (!user) return notFound();

  const oldestOrder = await db.order.findFirst({
    where: {
      store_id: user.store,
    },
    orderBy: {
      created_at: "asc",
    },
    select: {
      created_at: true,
    },
  });

  return oldestOrder?.created_at || new Date();
}
