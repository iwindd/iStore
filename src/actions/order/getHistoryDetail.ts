"use server";
import { PermissionConfig } from "@/config/permissionConfig";
import { CashoutType } from "@/enums/cashout";
import db from "@/libs/db";
import {
  assertStore,
  ifNotHasStorePermission,
} from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { Prisma } from "@prisma/client";

const getHistoryDetail = async (storeId: string, id: number) => {
  try {
    const ctx = await getPermissionContext(storeId);
    assertStore(ctx);
    const where: Prisma.OrderWhereInput = {
      id: id,
      store_id: ctx.storeId!,
      type: CashoutType.CASHOUT,
      creator_id: ifNotHasStorePermission(
        ctx,
        PermissionConfig.store.history.readAllUser,
      ),
    };

    const history = await db.order.findFirstOrThrow({
      where,
      select: {
        id: true,
        total: true,
        cost: true,
        profit: true,
        note: true,
        creator_id: true,
        created_at: true,
        creator: {
          select: {
            user: {
              select: {
                first_name: true,
                last_name: true,
              },
            },
          },
        },
      },
    });

    return history;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default getHistoryDetail;
