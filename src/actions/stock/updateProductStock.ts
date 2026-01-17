"use server";
import STOCK_CONFIG from "@/config/Stock";
import db from "@/libs/db";
import { ProductStockMovementType, StockReceiptStatus } from "@prisma/client";
import _ from "lodash";
import { addProductStock, removeProductStock } from "../product/stock";

export const updateProductStock = async (stock_id: number) => {
  const stock = await db.stockReceipt.update({
    where: {
      id: stock_id,
      status: StockReceiptStatus.DRAFT,
    },
    data: {
      status: StockReceiptStatus.PROCESSING,
    },
    select: {
      id: true,
      stock_recept_products: {
        select: {
          id: true,
          product_id: true,
          quantity: true,
          product: {
            select: {
              stock: true,
            },
          },
        },
      },
    },
  });

  const chunks = _.chunk(
    stock.stock_recept_products,
    STOCK_CONFIG.UPDATE_STOCK_CHUNK_SIZE,
  );
  const start_time = Date.now();

  for (const [_, chunk] of chunks.entries()) {
    await db.$transaction(async (tx) => {
      for (const payload of chunk) {
        if (payload.quantity > 0) {
          addProductStock(
            payload.product_id,
            payload.quantity,
            ProductStockMovementType.RECEIVE,
            { stock_receipt_id: stock.id },
          );
        }
        if (payload.quantity < 0) {
          removeProductStock(
            payload.product_id,
            Math.abs(payload.quantity),
            ProductStockMovementType.ADJUST,
            { stock_receipt_id: stock.id },
          );
        }
      }
    });
  }

  const end_time = Date.now();
  console.warn(
    `${stock.stock_recept_products.length} products updated in ${end_time - start_time} ms`,
  );

  return await db.stockReceipt.update({
    where: {
      id: stock_id,
    },
    data: {
      status: StockReceiptStatus.COMPLETED,
    },
    include: {
      stock_recept_products: true,
    },
  });
};
