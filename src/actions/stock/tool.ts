"use server";
import { PermissionConfig } from "@/config/permissionConfig";
import STOCK_CONFIG from "@/config/Stock";
import db from "@/libs/db";
import { assertStoreCan, PermissionContext } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
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
      take: STOCK_CONFIG.MAX_STOCK_PRODUCT_PER_STOCK,
      select: {
        quantity: true,
        alertCount: true,
        product: {
          select: {
            id: true,
            label: true,
            serial: true,
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
      label: p.label,
      serial: p.serial,
      stock: {
        quantity: p.stock,
      },
    }));
  }

  static async importFromMinStockValue(
    ctx: PermissionContext,
    validated: StockReceiptImportFromMinStockValueValues,
  ) {
    const productStocks = await db.product.findMany({
      where: {
        OR: [
          {
            stock: {
              quantity: {
                lte: validated.value,
              },
            },
          },
          {
            stock: null,
          },
        ],
        store_id: ctx.storeId!,
      },
      take: STOCK_CONFIG.MAX_STOCK_PRODUCT_PER_STOCK,
      select: {
        id: true,
        label: true,
        serial: true,
        stock: {
          select: {
            quantity: true,
            alertCount: true,
          },
        },
      },
    });

    return productStocks.map((ps) => ({
      product_id: ps.id,
      delta: ps.stock ? validated.value - ps.stock.quantity : validated.value,
      label: ps.label,
      serial: ps.serial,
      stock: ps.stock,
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
            product: {
              select: {
                label: true,
                serial: true,
                stock: {
                  select: {
                    quantity: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return stockReceipt.stock_recept_products.map((p) => ({
      product_id: p.product_id,
      delta: Math.abs(p.quantity),
      label: p.product.label,
      serial: p.product.serial,
      stock: p.product.stock,
    }));
  }
}

const ImportToolAction = async (
  storeSlug: string,
  payload: StockReceiptImportValues,
) => {
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
