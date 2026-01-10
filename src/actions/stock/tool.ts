"use server";
import {
  ImportFromMinStockPayload,
  ImportFromStockId,
  ImportPayload,
  ImportType,
} from "@/app/(products)/stocks/import";
import STOCK_CONFIG from "@/config/Stock";
import { StockPermissionEnum } from "@/enums/permission";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { User } from "@/libs/user";
import { StockValues } from "@/schema/Stock";

const ImportMinStock = async (
  payload: ImportFromMinStockPayload,
  user: User
) => {
  const products = await db.product.findMany({
    where: {
      store_id: user.store,
      stock: {
        lte: payload.product_min_stock
          ? db.product.fields.stock_min
          : payload.value,
      },
      deleted_at: null,
    },
    select: {
      id: true,
      serial: true,
      label: true,
      price: true,
      cost: true,
      stock: true,
      stock_min: true,
      category: {
        select: {
          label: true,
          overstock: true,
        },
      },
    },
    take: STOCK_CONFIG.MAX_STOCK_PRODUCT_PER_STOCK,
    orderBy: {
      sold: "desc",
    },
  });

  return products.map((p) => ({
    product_id: p.id,
    delta: payload.changedBy || p.stock_min,
  }));
};

const ImportStockId = async (payload: ImportFromStockId, user: User) => {
  const validated = await db.stock.findFirstOrThrow({
    where: { id: payload.id, store_id: user.store },
    select: {
      products: {
        select: {
          product_id: true,
          stock_after: true,
          stock_before: true,
        },
      },
    },
  });

  return validated.products.map((p) => ({
    product_id: p.product_id,
    delta: Math.abs(p.stock_after - p.stock_before),
  }));
};

const ImportToolAction = async (
  payload: ImportPayload
): Promise<StockValues["products"]> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    if (!user.hasPermission(StockPermissionEnum.CREATE))
      throw new Error("Forbidden");

    switch (payload.type) {
      case ImportType.FromStockId:
        return await ImportStockId(payload, user);
      case ImportType.FromMinStock:
        return await ImportMinStock(payload, user);
      default:
        throw new Error("Invalid payload");
    }
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default ImportToolAction;
