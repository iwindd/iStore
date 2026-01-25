"use server";
import { StorePermissionEnum } from "@/enums/permission";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";

const getExportStockData = async (storeSlug: string, id: number) => {
  try {
    const ctx = await getPermissionContext(storeSlug);
    assertStoreCan(ctx, StorePermissionEnum.PRODUCT_MANAGEMENT);

    const stock = await db.stockReceipt.findFirstOrThrow({
      where: {
        id: id,
        store_id: ctx.storeId,
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
