"use server";

import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";

export const getLineApplications = async (storeSlug: string) => {
  const ctx = await getPermissionContext(storeSlug);
  assertStoreCan(ctx, PermissionConfig.store.application.getLineApplications);
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
