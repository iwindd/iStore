"use server";
import STOCK_CONFIG from "@/config/Stock";
import { StockPermissionEnum } from "@/enums/permission";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { StockProduct } from "@/reducers/stockReducer";
import { StockState } from "@prisma/client";
import _ from "lodash";

export const updateStockProducts = async (
  products: {
    product_id: number;
    quantity: number;
  }[],
  CHUNK_SIZE = STOCK_CONFIG.UPDATE_STOCK_CHUNK_SIZE
) => {
  const chunks = _.chunk(products, CHUNK_SIZE);
  const start_time = Date.now();

  for (const [_, chunk] of chunks.entries()) {
    await db.$transaction(async () => {
      for (const payload of chunk) {
        await db.product.update({
          where: {
            id: payload.product_id,
            deleted_at: null,
          },
          data: {
            stock:
              payload.quantity < 0
                ? { decrement: Math.abs(payload.quantity) }
                : { increment: payload.quantity },
          },
        });
      }
    });
  }

  const end_time = Date.now();
  console.warn(
    `${products.length} products updated in ${end_time - start_time} ms`
  );
};

const stockCommit = async (
  products: StockProduct[],
  stockId?: number,
  options?: {
    note?: string;
    updateStock?: boolean;
  }
) => {
  options = options || {};
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    if (!user.hasPermission(StockPermissionEnum.CREATE))
      throw new Error("Forbidden");
    if (options.updateStock && !user.hasPermission(StockPermissionEnum.UPDATE))
      throw new Error("Forbidden");

    const stockState = options.updateStock
      ? StockState.SUCCESS
      : StockState.PROGRESS;

    const stock = await db.stock.upsert({
      where: {
        id: stockId || 0,
        store_id: user.store,
        state: StockState.PROGRESS,
      },
      create: {
        note: options.note || "",
        state: stockState,
        store_id: user.store,
        creator_id: user.employeeId,
        products: {
          create: products.map((product) => ({
            changed_by: product.quantity,
            product: {
              connect: {
                id: product.id,
              },
            },
          })),
        },
      },
      update: {
        note: options.note,
        state: stockState,
        ...(stockState != StockState.SUCCESS && {
          products: {
            deleteMany: {},
            create: products.map((product) => ({
              changed_by: product.quantity,
              product: {
                connect: {
                  id: product.id,
                },
              },
            })),
          },
        }),
      },
      select: {
        products: {
          select: {
            product_id: true,
            changed_by: true,
          },
        },
      },
    });

    if (options.updateStock)
      await updateStockProducts(
        stock.products.map((p) => {
          return {
            product_id: p.product_id,
            quantity: p.changed_by,
          };
        })
      );

    return true;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default stockCommit;
