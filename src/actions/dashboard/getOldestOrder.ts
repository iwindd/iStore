"use server";

import db from "@/libs/db";
import { assertStore } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";

export async function getOldestOrder(storeId: string) {
  const ctx = await getPermissionContext(storeId);
  assertStore(ctx);

  const oldestOrder = await db.order.findFirst({
    where: {
      store_id: ctx.storeId,
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
