"use server";
import { StockLayoutSelect } from "@/app/(products)/stocks/[id]/layout";
import STOCK_CONFIG from "@/config/Stock";
import db from "@/libs/db";
import { StockState } from "@prisma/client";
import _ from "lodash";

export const updateProductStock = async (stock_id: number) => {
  const stock = await db.stock.update({
    where: {
      id: stock_id,
      state: StockState.DRAFT,
    },
    data: {
      state: StockState.PROCESSING,
    },
    select: {
      products: {
        select: {
          id: true,
          product_id: true,
          stock_after: true,
          product: {
            select: {
              stock: true,
            },
          },
        },
      },
    },
  });

  const chunks = _.chunk(stock.products, STOCK_CONFIG.UPDATE_STOCK_CHUNK_SIZE);
  const start_time = Date.now();

  for (const [_, chunk] of chunks.entries()) {
    await db.$transaction(async () => {
      for (const payload of chunk) {
        const updatedProduct = await db.product.update({
          where: {
            id: payload.product_id,
            deleted_at: null,
          },
          data: {
            stock:
              payload.stock_after < 0
                ? { decrement: Math.abs(payload.stock_after) }
                : { increment: payload.stock_after },
          },
        });

        await db.stockProduct.update({
          where: {
            id: payload.id,
          },
          data: {
            stock_after: updatedProduct.stock,
            stock_before: payload.product.stock,
          },
        });
      }
    });
  }

  const end_time = Date.now();
  console.warn(
    `${stock.products.length} products updated in ${end_time - start_time} ms`
  );

  return await db.stock.update({
    where: {
      id: stock_id,
    },
    data: {
      state: StockState.COMPLETED,
    },
    select: StockLayoutSelect,
  });
};
