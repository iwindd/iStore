"use server";
import { Stock } from "@prisma/client";
import db from "@/libs/db";
import { getFilterRange } from "./range";
import { getUser } from "@/libs/session";
import { StockPermissionEnum } from "@/enums/permission";

const getStocks = async (store: number): Promise<Stock[]> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    return await db.stock.findMany({
      where: {
        store_id: store,
        user_store_id: user.hasPermission(StockPermissionEnum.READ) ? user.userStoreId : undefined,
        ...await getFilterRange()
      },
    });
  } catch (error) {
    return [];
  }
};

export default getStocks;
