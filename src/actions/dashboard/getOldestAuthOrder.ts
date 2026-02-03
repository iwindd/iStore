"use server";

import db from "@/libs/db";
import { assertStore } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";

export async function getOldestAuthOrder(storeId: string) {
  const ctx = await getPermissionContext(storeId);
  assertStore(ctx);

  const oldestOrder = await db.order.findFirst({
    where: {
      store_id: ctx.storeId,
      creator_id: ctx.employeeId,
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
