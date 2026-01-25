"use server";
import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { Prisma } from "@prisma/client";

export type ConsignmentDetail = Prisma.ConsignmentGetPayload<{
  include: {
    products: {
      include: {
        product: true;
      };
    };
  };
}>;

const getConsignment = async (
  storeSlug: string,
  id: number,
): Promise<ConsignmentDetail | null> => {
  const ctx = await getPermissionContext(storeSlug);
  assertStoreCan(ctx, PermissionConfig.store.consignment.get);

  return await db.consignment.findUnique({
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
};

export default getConsignment;
