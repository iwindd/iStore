"use server";

import db from "@/libs/db";
import { assertStore } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { Prisma } from "@prisma/client";

const DEFAULT_SELECT = {
  id: true,
  serial: true,
  label: true,
  stock: {
    select: {
      quantity: true,
    },
  },
} satisfies Prisma.ProductSelect;

export type ProductSelectorInstance = Prisma.ProductGetPayload<{
  select: typeof DEFAULT_SELECT;
}>;

const fetchProductSelector = async (
  storeId: string,
  id: number,
): Promise<ProductSelectorInstance | null> => {
  const ctx = await getPermissionContext(storeId);

  const product = await db.product.findUnique({
    where: {
      id: id,
      store_id: ctx.storeId!,
      deleted_at: null,
    },
    select: DEFAULT_SELECT,
  });

  return product;
};

const searchProductSelector = async (
  storeId: string,
  query: string,
): Promise<ProductSelectorInstance[]> => {
  const ctx = await getPermissionContext(storeId);
  assertStore(ctx);

  const where: Prisma.ProductWhereInput = {
    store_id: ctx.storeId!,
    deleted_at: null,
    OR: [
      {
        label: {
          contains: query,
          mode: "insensitive",
        },
      },
      {
        serial: {
          contains: query,
          mode: "insensitive",
        },
      },
    ],
  };

  const products = await db.product.findMany({
    where: where,
    select: DEFAULT_SELECT,
    take: 15,
  });

  return products;
};

export { fetchProductSelector, searchProductSelector };
