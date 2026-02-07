"use server";
import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { unstable_cache } from "next/cache";

const findProductBySerial = async (storeSlug: string, serial: string) => {
  const ctx = await getPermissionContext(storeSlug);
  assertStoreCan(ctx, PermissionConfig.store.cashier.cashout);

  const getProduct = unstable_cache(
    async () => {
      return await db.product.findUnique({
        where: {
          serial_store_id: {
            serial: serial,
            store_id: ctx.storeId!,
          },
        },
        select: {
          id: true,
          serial: true,
          label: true,
          price: true,
          cost: true,
          usePreorder: true,
          stock: {
            select: {
              quantity: true,
            },
          },
          category: {
            select: {
              label: true,
            },
          },
        },
      });
    },
    [serial, ctx.storeId!.toString()],
    {
      revalidate: 60,
      tags: [`product:${ctx.storeId}:${serial}`, `product:${ctx.storeId}`],
    },
  );

  const product = await getProduct();

  if (!product) {
    throw new Error("product_not_found");
  }

  return {
    ...product,
    price: Number(product.price),
    cost: Number(product.cost),
    stock: {
      quantity: Number(product.stock?.quantity ?? 0),
    },
  };
};

export default findProductBySerial;
