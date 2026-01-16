"use server";
import { HistoryPermissionEnum } from "@/enums/permission";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { DashboardRange } from "@/reducers/dashboardReducer";
import { Method } from "@prisma/client";
import { getDashboardRangeDate } from "./dashboard.helper";

export interface OrdersSummaryResponse {
  cashTotal: number;
  transferTotal: number;
  products: ProductSummary[];
}

export interface ProductSummary {
  id: string; // Composite key for datatable
  serial: string;
  label: string;
  count: number;
  price: number;
  total: number;
  method: Method;
}

export const getOrdersSummary = async (
  range: DashboardRange
): Promise<OrdersSummaryResponse> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    const filterRange = await getDashboardRangeDate(range);

    const orders = (await db.order.findMany({
      where: {
        store_id: user.store,
        creator_id: user.limitPermission(HistoryPermissionEnum.READ),
        created_at: {
          gte: filterRange.start,
          lte: filterRange.end,
        },
      },
      select: {
        method: true,
        total: true,
        products: {
          select: {
            count: true,
            total: true,
            product: {
              select: {
                serial: true,
                label: true,
              },
            },
          },
        },
      },
    })) as any[];

    let cashTotal = 0;
    let transferTotal = 0;
    const productMap: Record<string, ProductSummary> = {};

    orders.forEach((order) => {
      const orderTotal = Number(order.total);
      if (order.method === Method.CASH) {
        cashTotal += orderTotal;
      } else if (order.method === Method.BANK) {
        transferTotal += orderTotal;
      }

      order.products.forEach((p: any) => {
        const serial = p.product.serial;
        const label = p.product.label;
        const totalAmount = Number(p.total);
        const count = p.count;
        const price = count > 0 ? totalAmount / count : 0;

        const key = `${serial}-${label}-${price}-${order.method}`;
        if (!productMap[key]) {
          productMap[key] = {
            id: key,
            serial: serial,
            label: label,
            count: 0,
            price: price,
            total: 0,
            method: order.method,
          };
        }
        productMap[key].count += count;
        productMap[key].total += totalAmount;
      });
    });

    return {
      cashTotal,
      transferTotal,
      products: Object.values(productMap),
    };
  } catch (error) {
    console.error("getOrdersSummary error:", error);
    return {
      cashTotal: 0,
      transferTotal: 0,
      products: [],
    };
  }
};
