"use server";
import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { Prisma } from "@prisma/client";

const DEFAULT_SELECT: Prisma.CategorySelect = {
  id: true,
  label: true,
};

export type CategorySelectorInstance = Prisma.CategoryGetPayload<{
  select: {
    id: true;
    label: true;
  };
}>;

const fetchCategorySelector = async (
  storeId: string,
  id: number,
): Promise<CategorySelectorInstance | null> => {
  const ctx = await getPermissionContext(storeId);

  const category = await db.category.findUnique({
    where: {
      id: id,
      store_id: ctx.storeId!,
    },
    select: DEFAULT_SELECT,
  });

  return category;
};

const searchCategorySelector = async (
  storeId: string,
  query: string,
): Promise<CategorySelectorInstance[]> => {
  const ctx = await getPermissionContext(storeId);

  const categories = await db.category.findMany({
    where: {
      store_id: ctx.storeId!,
      label: {
        contains: query,
        mode: "insensitive",
      },
    },
    select: DEFAULT_SELECT,
    take: 15,
  });

  return categories;
};

const createCategorySelector = async (
  storeId: string,
  label: string,
): Promise<CategorySelectorInstance | null> => {
  try {
    const ctx = await getPermissionContext(storeId);
    assertStoreCan(ctx, PermissionConfig.store.category.select);

    const category = await db.category.create({
      data: {
        label: label,
        store_id: ctx.storeId!,
        creator_id: ctx.employeeId!,
      },
      select: DEFAULT_SELECT,
    });

    return category;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export {
  createCategorySelector,
  fetchCategorySelector,
  searchCategorySelector,
};
