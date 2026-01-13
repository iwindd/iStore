"use server";
import STOCK_CONFIG from "@/config/Stock";
import db from "@/libs/db";
import _ from "lodash";

export const setStockProduct = async (
  stock_receipt_id: number,
  products: { product_id: number; delta: number }[],
  removeOld?: boolean
) => {
  if (removeOld) {
    await db.stockReceiptProduct.deleteMany({
      where: {
        stock_id: stock_receipt_id,
      },
    });
  }

  const chunks = _.chunk(products, STOCK_CONFIG.SAVE_STOCK_CHUNK_SIZE);
  for (const chunk of chunks) {
    await db.stockReceiptProduct.createMany({
      data: chunk.map((product) => ({
        stock_id: stock_receipt_id,
        product_id: product.product_id,
        quantity: product.delta,
      })),
    });
  }
};
