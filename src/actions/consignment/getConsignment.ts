"use server";
import { StorePermissionEnum } from "@/enums/permission";
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
  assertStoreCan(ctx, StorePermissionEnum.CONSIGNMENT_MANAGEMENT);

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
