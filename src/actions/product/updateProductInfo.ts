"use server";
import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { getPath } from "@/router";
import { ProductUpdateSchema, ProductUpdateValues } from "@/schema/Product";
import { revalidatePath } from "next/cache";

const updateProductInfo = async (
  storeSlug: string,
  payload: ProductUpdateValues & { id: number },
) => {
  const ctx = await getPermissionContext(storeSlug);
  assertStoreCan(ctx, PermissionConfig.store.product.update);
  const validated = ProductUpdateSchema.parse(payload);

  const updatedProduct = await db.product.update({
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
    select: {
      label: true,
      price: true,
      cost: true,
      category_id: true,
    },
  });

  revalidatePath(
    getPath("projects.store.products.product", {
      store: storeSlug,
      id: payload.id.toString(),
    }),
  );
  return {
    ...updatedProduct,
    price: updatedProduct.price.toNumber(),
    cost: updatedProduct.cost.toNumber(),
  };
};

export default updateProductInfo;
