"use server";
import { StockItem } from "@/atoms/stock";
import { StockPermissionEnum } from "@/enums/permission";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";

interface StockItemMinimal {
  changed_by: number;
  product_id: number;
  stock_id?: number;
}

export const UpdateStockProducts = async (
  payload: StockItemMinimal[],
  batchSize = 20
) => {
  for (let i = 0; i < payload.length; i += batchSize) {
    const batch = payload.slice(i, i + batchSize);
    await db.$transaction(
      batch.map((product) => {
        return db.product.update({
          where: {
            id: product.product_id,
            deleted_at: null,
          },
          data: { stock: { increment: product.changed_by } },
        });
      })
    );
  }
};

export const validateProducts = async (
  payload: StockItem[],
  storeId: number
) => {
  const rawProducts = await db.product.findMany({
    where: {
      store_id: storeId,
      id: { in: payload.map((p) => p.id) },
      deleted_at: null,
    },
    select: {
      id: true,
    },
  });

  const validated = rawProducts.map((product) => {
    const data = payload.find((p) => p.id == product.id) as StockItem;
    return {
      changed_by: data.payload,
      product_id: product.id,
    };
  }) as StockItemMinimal[];

  return validated;
};

const Commit = async (
  payload: StockItem[],
  stockId: number,
  note?: string
): Promise<ActionResponse<StockItem[]>> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    if (!user.hasPermission(StockPermissionEnum.UPDATE))
      throw new Error("Forbidden");
    payload = payload.slice(0, 50);

    const data = await db.stock.update({
      where: {
        id: stockId,
      },
      data: {
        note: note || "",
        state: "SUCCESS",
      },
      select: {
        id: true,
        items: {
          select: { product_id: true, changed_by: true },
        },
      },
    });

    await UpdateStockProducts(data.items);
    return { success: true, data: payload };
  } catch (error) {
    return ActionError(error) as ActionResponse<StockItem[]>;
  }
};

export default Commit;
