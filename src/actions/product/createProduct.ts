"use server";
import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";
import { removeWhiteSpace } from "@/libs/formatter";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { ProductSchema, ProductValues } from "@/schema/Product";

const createProduct = async (storeSlug: string, payload: ProductValues) => {
  const ctx = await getPermissionContext(storeSlug);
  assertStoreCan(ctx, PermissionConfig.store.product.create);
  const validated = ProductSchema.parse(payload);

  const createdProduct = await db.product.create({
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

  return {
    ...createdProduct,
    price: createdProduct.price.toNumber(),
    cost: createdProduct.cost.toNumber(),
  };
};

export default createProduct;
