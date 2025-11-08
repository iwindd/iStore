"use server";
import { HistoryPermissionEnum } from "@/enums/permission";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { getFilterRange } from "./range";

const getOrders = async (store: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    return await db.order.findMany({
      orderBy: {
        id: "desc",
      },
      where: {
        store_id: store,
        creator_id: !user.hasPermission(HistoryPermissionEnum.READ)
          ? user.userStoreId
          : undefined,
        ...(await getFilterRange()),
      },
      include: {
        products: {
          select: {
            id: true,
            serial: true,
            label: true,
            count: true,
            overstock: true,
            overstock_at: true,
          },
        },
      },
    });
  } catch (error) {
    return [];
  }
};

export default getOrders;
