"use server";
import { StockPermissionEnum } from "@/enums/permission";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { Stock } from "@prisma/client";
import { getFilterRange } from "./range";

const getStocks = async (store: string): Promise<Stock[]> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    return await db.stock.findMany({
      where: {
        store_id: store,
        creator_id: user.limitPermission(StockPermissionEnum.READ),
        ...(await getFilterRange()),
      },
    });
  } catch (error) {
    return [];
  }
};

export default getStocks;
