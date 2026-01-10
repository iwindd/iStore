"use server";
import STOCK_CONFIG from "@/config/Stock";
import db from "@/libs/db";
import _ from "lodash";

export const setStockProduct = async (
  stock_id: number,
  products: { product_id: number; delta: number }[],
  removeOld?: boolean
) => {
  const chunks = _.chunk(products, STOCK_CONFIG.SAVE_STOCK_CHUNK_SIZE);

  if (removeOld) {
    await db.stockProduct.deleteMany({
      where: {
        stock_id,
      },
    });
  }

  for (const chunk of chunks) {
    await db.stockProduct.createMany({
      data: chunk.map((product) => ({
        stock_id,
        product_id: product.product_id,
        stock_before: 0,
        stock_after: product.delta,
      })),
    });
  }
};
