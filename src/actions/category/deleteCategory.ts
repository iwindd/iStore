"use server";
import { StorePermissionEnum } from "@/enums/permission";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";

const deleteCategory = async (storeSlug: string, id: number) => {
  const ctx = await getPermissionContext(storeSlug);
  assertStoreCan(ctx, StorePermissionEnum.PRODUCT_MANAGEMENT);

  await db.category.delete({
    where: {
      id: id,
      store_id: ctx.storeId,
    },
  });
};

export default deleteCategory;
