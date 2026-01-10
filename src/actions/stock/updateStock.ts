"use server";

import {
  StockLayoutSelect,
  StockLayoutValue,
} from "@/app/(products)/stocks/[id]/layout";
import { StockPermissionEnum } from "@/enums/permission";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { StockValues } from "@/schema/Stock";
import { StockState } from "@prisma/client";
import { setStockProduct } from "./setStockProduct";
import { updateProductStock } from "./updateProductStock";

const updateStock = async (
  payload: StockValues,
  stockId: number
): Promise<StockLayoutValue> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    if (!user.hasPermission(StockPermissionEnum.UPDATE))
      throw new Error("Forbidden");

    const stock = await db.stock.update({
      where: {
        id: stockId,
        state: StockState.DRAFT,
      },
      data: {
        note: payload.note,
        state: StockState.CREATING,
        store_id: user.store,
        creator_id: user.employeeId,
      },
    });

    await setStockProduct(stock.id, payload.products, true);

    const drafted = await db.stock.update({
      where: { id: stock.id },
      data: { state: StockState.DRAFT },
      select: StockLayoutSelect,
    });

    if (payload.update) {
      return await updateProductStock(stock.id);
    }

    return drafted;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default updateStock;
