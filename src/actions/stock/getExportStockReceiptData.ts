"use server";
import { StockPermissionEnum } from "@/enums/permission";
import db from "@/libs/db";
import { getUser } from "@/libs/session";

const getExportStockData = async (id: number) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    const stock = await db.stockReceipt.findFirstOrThrow({
      where: {
        id: id,
        store_id: user.store,
        creator_id: user.limitPermission(StockPermissionEnum.READ),
      },
      select: {
        stock_recept_products: {
          select: {
            quantity: true,
            product: true,
          },
        },
      },
    });

    return stock.stock_recept_products;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default getExportStockData;
