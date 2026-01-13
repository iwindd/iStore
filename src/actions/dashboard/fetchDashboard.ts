"use server";
import {
  BorrowPermissionEnum,
  HistoryPermissionEnum,
  ProductPermissionEnum,
  StockPermissionEnum,
} from "@/enums/permission";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { getFilterRange } from "./range";

const fetchDashboard = async () => {
  try {
    const user = await getUser();
    if (!user) return null;
    const storeId = user.store;
    const data = await db.$transaction([
      db.order.findMany({
        orderBy: {
          id: "desc",
        },
        where: {
          store_id: storeId,
          creator_id: user.limitPermission(HistoryPermissionEnum.READ),
          ...(await getFilterRange()),
        },
        select: {
          id: true,
          type: true,
          method: true,
          profit: true,
          created_at: true,
          note: true,
          price: true,
          products: {
            select: {
              id: true,
              serial: true,
              label: true,
              count: true,
            },
          },
        },
      }),
      db.borrow.count({
        where: {
          store_id: storeId,
          creator_id: user.limitPermission(BorrowPermissionEnum.READ),
          ...(await getFilterRange()),
        },
      }),
      db.product.findMany({
        where: {
          store_id: storeId,
          creator_id: user.limitPermission(ProductPermissionEnum.READ),
          ...(await getFilterRange()),
          deleted_at: null,
        },
        select: {
          stock: true,
        },
      }),
      db.stockReceipt.count({
        where: {
          store_id: storeId,
          creator_id: user.limitPermission(StockPermissionEnum.READ),
          ...(await getFilterRange()),
        },
      }),
    ]);

    return {
      orders: data[0].map((order) => ({
        ...order,
        created_at: order.created_at.toISOString(),
      })),
      borrows: data[1],
      products: data[2],
      stocks: data[3],
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return {
      orders: [],
      borrows: [],
      products: [],
      stocks: [],
    };
  }
};

export default fetchDashboard;
