"use server";
import { StorePermissionEnum } from "@/enums/permission";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";

const deleteProduct = async (storeSlug: string, id: number) => {
  const ctx = await getPermissionContext(storeSlug);
  assertStoreCan(ctx, StorePermissionEnum.PRODUCT_MANAGEMENT);
  return await db.product.delete({
    where: {
      id: id,
      store_id: ctx.storeId!,
    },
  });
};

export default deleteProduct;
