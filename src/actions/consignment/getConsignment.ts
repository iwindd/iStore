"use server";
import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { Prisma } from "@prisma/client";

export type ConsignmentDetail = Omit<
  Prisma.ConsignmentGetPayload<{
    include: {
      products: {
        include: {
          product: true;
        };
      };
    };
  }>,
  "products"
> & {
  products: (Omit<
    Prisma.ConsigmentProductGetPayload<{
      include: {
        product: true;
      };
    }>,
    "product"
  > & {
    product: Omit<Prisma.ProductGetPayload<true>, "price" | "cost"> & {
      price: number;
      cost: number;
    };
  })[];
};

const getConsignment = async (
  storeSlug: string,
  id: number,
): Promise<ConsignmentDetail | null> => {
  const ctx = await getPermissionContext(storeSlug);
  assertStoreCan(ctx, PermissionConfig.store.consignment.get);

  const consignment = await db.consignment.findUnique({
    where: {
      id,
      store_id: ctx.storeId!,
    },
    include: {
      products: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!consignment) return null;

  return {
    ...consignment,
    products: consignment.products.map((item) => ({
      ...item,
      product: {
        ...item.product,
        price: item.product.price.toNumber(),
        cost: item.product.cost.toNumber(),
      },
    })),
  };
};

export default getConsignment;
