"use server";
import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";

const deleteProduct = async (storeSlug: string, id: number) => {
  const ctx = await getPermissionContext(storeSlug);
  assertStoreCan(ctx, PermissionConfig.store.product.delete);
  await db.product.delete({
    where: {
      id: id,
      store_id: ctx.storeId!,
    },
  });
};

export default deleteProduct;
