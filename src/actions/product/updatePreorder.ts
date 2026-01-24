"use server";
import { StorePermissionEnum } from "@/enums/permission";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { ProductPreorderSchema, ProductPreorderValues } from "@/schema/Product";

const updatePreorder = async (
  storeSlug: string,
  payload: ProductPreorderValues & { id: number },
) => {
  const ctx = await getPermissionContext(storeSlug);
  assertStoreCan(ctx, StorePermissionEnum.PRODUCT_MANAGEMENT);
  const validated = ProductPreorderSchema.parse(payload);

  return await db.product.update({
    where: { id: payload.id, store_id: ctx.storeId! },
    data: {
      usePreorder: validated.usePreorder,
    },
  });
};

export default updatePreorder;
