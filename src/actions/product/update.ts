"use server";
import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { ProductUpdateSchema, ProductUpdateValues } from "@/schema/Product";

const updateProduct = async (
  storeSlug: string,
  payload: ProductUpdateValues & { id: number },
) => {
  const ctx = await getPermissionContext(storeSlug);
  assertStoreCan(ctx, PermissionConfig.store.product.update);
  const validated = ProductUpdateSchema.parse(payload);

  return await db.product.update({
    where: {
      id: payload.id,
      store_id: ctx.storeId!,
    },
    data: {
      label: validated.label,
      price: validated.price,
      cost: validated.cost,
      category_id: validated.category_id,
    },
  });
};

export default updateProduct;
