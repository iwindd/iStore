"use server";

import db from "@/libs/db";
import {
  ConsignmentStatus,
  PreOrderStatus,
  StockReceiptStatus,
} from "@prisma/client";

export interface SidebarNotifications {
  preorder: number;
  consignment: number;
  products: number;
  stockReceipt: number;
  promotion: number;
}

export const getSidebarNotifications = async (
  storeSlug: string,
): Promise<SidebarNotifications> => {
  const store = await db.store.findUnique({
    where: { slug: storeSlug },
    select: { id: true },
  });

  if (!store) {
    return {
      preorder: 0,
      consignment: 0,
      products: 0,
      stockReceipt: 0,
      promotion: 0,
    };
  }

  const [preorder, consignment, productsWithStock, stockReceipt, promotion] =
    await Promise.all([
      db.orderPreOrder.count({
        where: {
          status: PreOrderStatus.PENDING,
          order: { store_id: store.id },
        },
      }),
      db.consignment.count({
        where: {
          status: ConsignmentStatus.PENDING,
          store_id: store.id,
        },
      }),
      db.product.findMany({
        where: {
          store_id: store.id,
          usePreorder: true,
        },
        select: {
          stock: {
            select: {
              quantity: true,
              alertCount: true,
            },
          },
        },
      }),
      db.stockReceipt.count({
        where: {
          status: StockReceiptStatus.DRAFT,
          store_id: store.id,
        },
      }),
      db.event.count({
        where: {
          store_id: store.id,
          start_at: { lte: new Date() },
          end_at: { gte: new Date() },
          disabled_at: null,
        },
      }),
    ]);

  const productCount = productsWithStock.filter(
    (p) => p.stock && p.stock.quantity < p.stock.alertCount,
  ).length;

  return {
    preorder,
    consignment,
    products: productCount,
    stockReceipt,
    promotion,
  };
};
