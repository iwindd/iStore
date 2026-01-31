"use server";
import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";

const recoveryProduct = async (storeSlug: string, id: number) => {
  const ctx = await getPermissionContext(storeSlug);
  assertStoreCan(ctx, PermissionConfig.store.product.recovery);
  return await db.product.update({
    where: {
      id: id,
      store_id: ctx.storeId!,
      deleted_at: {
        not: null,
      },
    },
    data: {
      deleted_at: null,
    },
    select: {
      id: true,
    },
  });
};

export default recoveryProduct;
