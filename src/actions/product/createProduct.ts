"use server";
import { StorePermissionEnum } from "@/enums/permission";
import db from "@/libs/db";
import { removeWhiteSpace } from "@/libs/formatter";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { ProductSchema, ProductValues } from "@/schema/Product";

const createProduct = async (storeSlug: string, payload: ProductValues) => {
  const ctx = await getPermissionContext(storeSlug);
  assertStoreCan(ctx, StorePermissionEnum.PRODUCT_MANAGEMENT);
  const validated = ProductSchema.parse(payload);

  return await db.product.create({
    data: {
      serial: removeWhiteSpace(validated.serial),
      label: validated.label,
      store_id: ctx.storeId!,
      creator_id: ctx.employeeId!,
      stock: {
        create: {
          quantity: 0,
        },
      },
    },
  });
};

export default createProduct;
