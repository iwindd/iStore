"use server";

import { StorePermissionEnum } from "@/enums/permission";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";

const getHistoryCreators = async (storeSlug: string) => {
  try {
    const ctx = await getPermissionContext(storeSlug);
    assertStoreCan(ctx, StorePermissionEnum.HISTORY_READ_ALL);

    // Get employees who have created orders for this store
    const employees = await db.employee.findMany({
      where: {
        store_id: ctx.storeId!,
        orders: {
          some: {},
        },
      },
      select: {
        id: true,
        user: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
      },
    });

    return employees.map((e) => ({
      id: e.id,
      name: `${e.user.first_name} ${e.user.last_name}`,
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default getHistoryCreators;
