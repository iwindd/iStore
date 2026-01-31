"use server";
import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { ProductPreorderSchema, ProductPreorderValues } from "@/schema/Product";

const updatePreorder = async (
  storeSlug: string,
  payload: ProductPreorderValues & { id: number },
) => {
  const ctx = await getPermissionContext(storeSlug);
  assertStoreCan(ctx, PermissionConfig.store.product.updatePreorder);
  const validated = ProductPreorderSchema.parse(payload);

  return await db.product.update({
    where: { id: payload.id, store_id: ctx.storeId! },
    data: {
      usePreorder: validated.usePreorder,
    },
    select: {
      usePreorder: true,
    },
  });
};

export default updatePreorder;
