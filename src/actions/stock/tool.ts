"use server";
import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";
import { assertStoreCan, PermissionContext } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { StockValues } from "@/schema/Stock";
import {
  StockReceiptImportFromMinStockValueValues,
  StockReceiptImportFromStockIdValues,
  StockReceiptImportSchema,
  StockReceiptImportType,
  StockReceiptImportValues,
} from "@/schema/StockReceiptImport";

class StockReceiptImportTool {
  static async importFromMinStockAlert(ctx: PermissionContext) {
    const productStocks = await db.productStock.findMany({
      where: {
        product: {
          store_id: ctx.storeId!,
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
    ctx: PermissionContext,
    validated: StockReceiptImportFromMinStockValueValues,
  ) {
    const productStocks = await db.productStock.findMany({
      where: {
        product: {
          store_id: ctx.storeId!,
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
    ctx: PermissionContext,
    validated: StockReceiptImportFromStockIdValues,
  ) {
    const stockReceipt = await db.stockReceipt.findFirstOrThrow({
      where: { id: validated.id, store_id: ctx.storeId! },
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
  storeSlug: string,
  payload: StockReceiptImportValues,
): Promise<StockValues["products"]> => {
  try {
    const ctx = await getPermissionContext(storeSlug);
    assertStoreCan(ctx, PermissionConfig.store.stock.tools);

    const validated = StockReceiptImportSchema.parse(payload);
    switch (validated.type) {
      case StockReceiptImportType.FromMinStockAlert:
        return await StockReceiptImportTool.importFromMinStockAlert(ctx);
      case StockReceiptImportType.FromMinStockValue:
        return await StockReceiptImportTool.importFromMinStockValue(
          ctx,
          validated,
        );
      case StockReceiptImportType.FromStockId:
        return await StockReceiptImportTool.importFromStockId(ctx, validated);
      default:
        throw new Error("invalid_type");
    }
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default ImportToolAction;
