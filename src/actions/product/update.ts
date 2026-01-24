"use server";
import { StorePermissionEnum } from "@/enums/permission";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { ProductUpdateSchema, ProductUpdateValues } from "@/schema/Product";

const updateProduct = async (
  storeSlug: string,
  payload: ProductUpdateValues & { id: number },
) => {
  const ctx = await getPermissionContext(storeSlug);
  assertStoreCan(ctx, StorePermissionEnum.PRODUCT_MANAGEMENT);
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
      /* keywords: validated.keywords, */ // TODO:: Refactor this one
    },
  });
};

export default updateProduct;
