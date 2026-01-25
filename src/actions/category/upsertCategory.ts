"use server";
import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { CategorySchema, CategoryValues } from "@/schema/Category";

const upsertCategory = async (
  storeSlug: string,
  payload: CategoryValues & { id?: number },
) => {
  const ctx = await getPermissionContext(storeSlug);
  assertStoreCan(ctx, PermissionConfig.store.category.upsert);

  const validated = CategorySchema.parse(payload);

  const category = await db.$transaction(async (tx) => {
    const category = await tx.category.upsert({
      where: {
        id: Number(payload.id || 0),
      },
      create: {
        label: validated.label,
        store_id: ctx.storeId!,
        creator_id: ctx.employeeId!,
      },
      update: {
        label: validated.label,
      },
    });

    if (payload.active) {
      await tx.product.updateMany({
        where: {
          category_id: null,
        },
        data: {
          category_id: category.id,
        },
      });
    }

    return category;
  });

  return category;
};

export default upsertCategory;
