"use server";
import { StockPermissionEnum } from "@/enums/permission";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { User } from "@/libs/user.server";
import { StockValues } from "@/schema/Stock";
import {
  StockReceiptImportFromMinStockValueValues,
  StockReceiptImportFromStockIdValues,
  StockReceiptImportSchema,
  StockReceiptImportType,
  StockReceiptImportValues,
} from "@/schema/StockReceiptImport";

class StockReceiptImportTool {
  static async importFromMinStockAlert(user: User) {
    const productStocks = await db.productStock.findMany({
      where: {
        product: {
          store_id: user.store,
        },
        useAlert: true,
        quantity: {
          lte: db.productStock.fields.alertCount,
        },
      },
      select: {
        quantity: true,
        alertCount: true,
        product: {
          select: {
            id: true,
          },
        },
      },
    });

    const products = productStocks.flatMap((ps) => ({
      ...ps.product,
      alertCount: ps.alertCount,
      stock: ps.quantity,
    }));

    return products.map((p) => ({
      product_id: p.id,
      delta: p.alertCount - p.stock,
    }));
  }

  static async importFromMinStockValue(
    user: User,
    validated: StockReceiptImportFromMinStockValueValues,
  ) {
    const productStocks = await db.productStock.findMany({
      where: {
        product: {
          store_id: user.store,
        },
        quantity: {
          lte: validated.value,
        },
      },
      select: {
        quantity: true,
        alertCount: true,
        product: {
          select: {
            id: true,
          },
        },
      },
    });

    const products = productStocks.flatMap((ps) => ({
      ...ps.product,
      alertCount: ps.alertCount,
      stock: ps.quantity,
    }));

    return products.map((p) => ({
      product_id: p.id,
      delta: validated.value - p.stock,
    }));
  }

  static async importFromStockId(
    user: User,
    validated: StockReceiptImportFromStockIdValues,
  ) {
    const stockReceipt = await db.stockReceipt.findFirstOrThrow({
      where: { id: validated.id, store_id: user.store },
      select: {
        stock_recept_products: {
          select: {
            product_id: true,
            quantity: true,
          },
        },
      },
    });

    return stockReceipt.stock_recept_products.map((p) => ({
      product_id: p.product_id,
      delta: Math.abs(p.quantity),
    }));
  }
}

const ImportToolAction = async (
  payload: StockReceiptImportValues,
): Promise<StockValues["products"]> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    if (!user.hasPermission(StockPermissionEnum.CREATE))
      throw new Error("Forbidden");

    const validated = StockReceiptImportSchema.parse(payload);
    switch (validated.type) {
      case StockReceiptImportType.FromMinStockAlert:
        return await StockReceiptImportTool.importFromMinStockAlert(user);
      case StockReceiptImportType.FromMinStockValue:
        return await StockReceiptImportTool.importFromMinStockValue(
          user,
          validated,
        );
      case StockReceiptImportType.FromStockId:
        return await StockReceiptImportTool.importFromStockId(user, validated);
      default:
        throw new Error("invalid_type");
    }
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default ImportToolAction;
