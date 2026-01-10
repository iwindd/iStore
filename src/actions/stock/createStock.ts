"use server";

import STOCK_CONFIG from "@/config/Stock";
import { StockPermissionEnum } from "@/enums/permission";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { StockValues } from "@/schema/Stock";
import { StockState } from "@prisma/client";
import _ from "lodash";

const createStock = async (payload: StockValues) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    if (!user.hasPermission(StockPermissionEnum.CREATE))
      throw new Error("Forbidden");

    const stock = await db.stock.create({
      data: {
        note: payload.note,
        state: StockState.CREATING,
        store_id: user.store,
        creator_id: user.employeeId,
      },
    });

    const chunks = _.chunk(
      payload.products,
      STOCK_CONFIG.SAVE_STOCK_CHUNK_SIZE
    );

    for (const chunk of chunks) {
      await db.stockProduct.createMany({
        data: chunk.map((product) => ({
          stock_id: stock.id,
          product_id: product.product_id,
          stock_before: 0,
          stock_after: 0,
        })),
      });
    }

    return await db.stock.update({
      where: { id: stock.id },
      data: { state: StockState.DRAFT },
    });
  } catch (error) {
    console.error(error);
  }
};

export default createStock;
