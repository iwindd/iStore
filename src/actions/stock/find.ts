"use server";
import { StockPermissionEnum } from "@/enums/permission";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import {
  Product,
  Stock as StockOriginal,
  StockProduct as StockProductOriginal,
} from "@prisma/client";

interface StockProduct extends StockProductOriginal {
  product: Product;
}

interface Stock extends StockOriginal {
  products?: StockProduct[];
}

const GetStock = async (
  id: number,
  includeItem?: boolean
): Promise<ActionResponse<Stock | null>> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    const stock = await db.stock.findFirst({
      where: {
        id: id,
        store_id: user.store,
        creator_id: user.onPermission(StockPermissionEnum.READ),
      },
      ...(includeItem
        ? {
            include: {
              products: {
                include: {
                  product: true,
                },
              },
            },
          }
        : {}),
    });

    return {
      success: true,
      data: stock,
    };
  } catch (error) {
    return ActionError(error) as ActionResponse<Stock | null>;
  }
};

export default GetStock;
