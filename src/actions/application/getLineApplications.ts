"use server";

import { StorePermissionEnum } from "@/enums/permission";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";

export const getLineApplications = async (storeSlug: string) => {
  const ctx = await getPermissionContext(storeSlug);
  assertStoreCan(ctx, StorePermissionEnum.APPLICATION_MANAGEMENT);
  const applications = await db.lineApplication.findMany({
    where: {
      store_id: ctx.storeId!,
    },
    orderBy: {
      created_at: "desc",
    },
  });
  return applications;
};
