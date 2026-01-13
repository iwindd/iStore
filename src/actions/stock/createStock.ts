"use server";

import { StockPermissionEnum } from "@/enums/permission";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { StockValues } from "@/schema/Stock";
import { StockReceiptStatus } from "@prisma/client";
import { setStockProduct } from "./setStockProduct";
import { updateProductStock } from "./updateProductStock";

const createStock = async (payload: StockValues) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    if (!user.hasPermission(StockPermissionEnum.CREATE))
      throw new Error("Forbidden");

    const stock = await db.stockReceipt.create({
      data: {
        note: payload.note,
        status: StockReceiptStatus.CREATING,
        store_id: user.store,
        creator_id: user.employeeId,
      },
    });

    await setStockProduct(stock.id, payload.products);

    const drafted = await db.stockReceipt.update({
      where: { id: stock.id },
      data: { status: StockReceiptStatus.DRAFT },
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

export default createStock;
