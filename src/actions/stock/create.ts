"use server";
import { StockItem } from "@/atoms/stock";
import { StockPermissionEnum } from "@/enums/permission";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { UpdateStockProducts, validateProducts } from "./commit";

const Create = async (
  payload: StockItem[],
  instant?: boolean,
  note?: string
): Promise<ActionResponse<StockItem[]>> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    if (!user.hasPermission(StockPermissionEnum.CREATE))
      throw new Error("Forbidden");
    if (instant && !user.hasPermission(StockPermissionEnum.UPDATE))
      throw new Error("Forbidden");
    payload = payload.slice(0, 50);
    const validated = await validateProducts(payload, user.store);

    const data = await db.stock.create({
      data: {
        note: note || "",
        state: instant ? "SUCCESS" : "PROGRESS",
        store_id: user.store,
        creator_id: user.userStoreId,
        products: {
          create: validated.map((product) => ({
            changed_by: product.changed_by,
            product_id: product.product_id,
          })),
        },
      },
      select: {
        id: true,
        products: {
          select: { product_id: true, changed_by: true },
        },
      },
    });

    if (instant) await UpdateStockProducts(data.products);

    return { success: true, data: payload };
  } catch (error) {
    console.error(error);
    return ActionError(error) as ActionResponse<StockItem[]>;
  }
};

export default Create;
