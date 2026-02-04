"use server";

import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";
import {
  assertStoreCan,
  getStoreUnstableCacheKey,
  ifNotHasStorePermission,
  PermissionContext,
} from "@/libs/permission/context";
import {
  DashboardRange,
  EnumDashboardRange,
} from "@/reducers/dashboardReducer";

import { Method, PreOrderStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import dayjs from "dayjs";
import { unstable_cache } from "next/cache";

export async function getSoldSummary(
  ctx: PermissionContext,
  range: DashboardDateRange,
) {
  if (
    !assertStoreCan(ctx, PermissionConfig.store.dashboard.viewOrderSoldStat, {
      throw: false,
    })
  ) {
    return { sold: 0 };
  }

  const orderProductCount = await db.orderProduct.aggregate({
    where: {
      order: {
        store_id: ctx.storeId,
        created_at: {
          gte: range.start,
          lte: range.end,
        },
      },
    },
    _sum: {
      count: true,
    },
  });

  return {
    sold: orderProductCount._sum.count ?? 0,
  };
}

export async function getPreOrderSummary(
  ctx: PermissionContext,
  range: DashboardDateRange,
) {
  if (
    !assertStoreCan(ctx, PermissionConfig.store.dashboard.viewPreorderStat, {
      throw: false,
    })
  ) {
    return { returned: 0, pending: 0 };
  }

  type PreorderGroupResult = {
    status: PreOrderStatus;
    _sum: { count: number | null };
  };

  const preorderSummary = (await db.orderPreOrder.groupBy({
    by: ["status"],
    where: {
      order: {
        store_id: ctx.storeId,
        created_at: {
          gte: range.start,
          lte: range.end,
        },
      },
      status: {
        in: [PreOrderStatus.RETURNED, PreOrderStatus.PENDING],
      },
    },
    _sum: {
      count: true,
    },
  })) as PreorderGroupResult[];

  const summary = {
    returned: 0,
    pending: 0,
  };

  for (const row of preorderSummary) {
    if (row.status === PreOrderStatus.RETURNED) {
      summary.returned = row._sum.count ?? 0;
    }
    if (row.status === PreOrderStatus.PENDING) {
      summary.pending = row._sum.count ?? 0;
    }
  }

  return summary;
}

export async function getConsignmentSummary(
  ctx: PermissionContext,
  range: DashboardDateRange,
) {
  if (
    !assertStoreCan(ctx, PermissionConfig.store.dashboard.viewConsignmentStat, {
      throw: false,
    })
  ) {
    return 0;
  }

  return db.consignment.count({
    where: {
      store_id: ctx.storeId,
      created_at: {
        gte: range.start,
        lte: range.end,
      },
    },
  });
}

export async function getProductSummary(ctx: PermissionContext) {
  if (
    !assertStoreCan(ctx, PermissionConfig.store.dashboard.viewLowstockStat, {
      throw: false,
    })
  ) {
    return { lowStockCount: 0 };
  }

  const lowStockCount = await db.productStock.count({
    where: {
      product: {
        store_id: ctx.storeId,
        deleted_at: null,
      },
      useAlert: true,
      quantity: {
        lt: db.productStock.fields.alertCount,
      },
    },
  });

  return {
    lowStockCount,
  };
}

export async function getPaymentMethodTrafficSummary(
  ctx: PermissionContext,
  range: DashboardDateRange,
) {
  type PaymentMethodGroupResult = {
    method: Method;
    _count: {
      id: number;
    };
    _sum: {
      total: Decimal;
    };
  };

  const getCachedPaymentMethodTrafficSummary = unstable_cache(async () => {
    const data = (await db.order.groupBy({
      by: ["method"],
      where: {
        store_id: ctx.storeId,
        creator_id: ifNotHasStorePermission(
          ctx,
          PermissionConfig.store.dashboard.viewStorePaymentMethodTraffic,
          ctx.employeeId,
        ),
        created_at: {
          gte: range.start,
          lte: range.end,
        },
      },
      _count: { id: true },
      _sum: {
        total: true,
      },
    })) as PaymentMethodGroupResult[];

    const totalOrders = data.reduce((acc, row) => acc + row._count.id, 0);
    const methodCash = {
      method: Method.CASH,
      percent: 50,
      count: 0,
    };

    const methodBank = {
      method: Method.BANK,
      percent: 50,
      count: 0,
    };

    for (const row of data) {
      if (row.method === Method.CASH) {
        methodCash.percent =
          totalOrders === 0 ? 0 : (row._count.id / totalOrders) * 100;
        methodCash.count = row._sum.total.toNumber();
      }
      if (row.method === Method.BANK) {
        methodBank.percent =
          totalOrders === 0 ? 0 : (row._count.id / totalOrders) * 100;
        methodBank.count = row._sum.total.toNumber();
      }
    }

    return [methodCash, methodBank];
  }, [
    "paymentMethodTraffix",
    range.start.toString(),
    range.end.toString(),
    ...getStoreUnstableCacheKey(ctx),
  ]);

  return getCachedPaymentMethodTrafficSummary();
}

export type DashboardDateRange = {
  start: Date;
  end: Date;
};

export async function getDashboardRangeDate(range: DashboardRange) {
  try {
    switch (range.type) {
      case EnumDashboardRange.TODAY:
        return {
          start: dayjs().startOf("day").toDate(),
          end: dayjs().endOf("day").toDate(),
        };
      case EnumDashboardRange.WEEK:
        return {
          start: dayjs().startOf("week").toDate(),
          end: dayjs().endOf("week").toDate(),
        };
      case EnumDashboardRange.MONTH:
        return {
          start: dayjs().startOf("month").toDate(),
          end: dayjs().endOf("month").toDate(),
        };
      case EnumDashboardRange.YEAR:
        return {
          start: dayjs().startOf("year").toDate(),
          end: dayjs().endOf("year").toDate(),
        };
      case EnumDashboardRange.ALL_TIME:
        return {
          start: new Date(0),
          end: dayjs().endOf("day").toDate(),
        };
      default:
        return {
          start: dayjs(range.start).toDate(),
          end: dayjs(range.end).toDate(),
        };
    }
  } catch (e) {
    console.error(e);
    return {
      start: dayjs().startOf("day").toDate(),
      end: dayjs().endOf("day").toDate(),
    };
  }
}

export async function getYearlySalesData(ctx: PermissionContext, year: number) {
  const startOfYear = dayjs().year(year).startOf("year").toDate();
  const endOfYear = dayjs().year(year).endOf("year").toDate();

  // Get orders for the specified year
  const orders = await db.order.findMany({
    where: {
      store_id: ctx.storeId,
      created_at: {
        gte: startOfYear,
        lte: endOfYear,
      },
    },
    select: {
      created_at: true,
      total: true,
      cost: true,
    },
  });

  // Initialize monthly data (0-11 for Jan-Dec)
  const monthlyIncome: number[] = new Array(12).fill(0);
  const monthlyExpenses: number[] = new Array(12).fill(0);

  // Aggregate data by month
  orders.forEach((order) => {
    const month = dayjs(order.created_at).month(); // 0-11
    monthlyIncome[month] += order.total.toNumber();
    monthlyExpenses[month] += order.cost.toNumber();
  });

  // Calculate totals
  const totalIncome = monthlyIncome.reduce((sum, val) => sum + val, 0);
  const totalExpenses = monthlyExpenses.reduce((sum, val) => sum + val, 0);

  // Get previous year data for comparison
  const previousYearStart = dayjs()
    .year(year - 1)
    .startOf("year")
    .toDate();
  const previousYearEnd = dayjs()
    .year(year - 1)
    .endOf("year")
    .toDate();

  const previousYearOrders = await db.order.aggregate({
    where: {
      store_id: ctx.storeId,
      created_at: {
        gte: previousYearStart,
        lte: previousYearEnd,
      },
    },
    _sum: {
      total: true,
    },
  });

  const previousYearIncome = previousYearOrders._sum.total?.toNumber() || 0;
  const yearOverYearChange =
    previousYearIncome > 0
      ? ((totalIncome - previousYearIncome) / previousYearIncome) * 100
      : 0;

  return {
    monthlyIncome,
    monthlyExpenses,
    totalIncome,
    totalExpenses,
    yearOverYearChange,
  };
}

export async function getYearlyAuthSalesData(
  ctx: PermissionContext,
  year: number,
) {
  const startOfYear = dayjs().year(year).startOf("year").toDate();
  const endOfYear = dayjs().year(year).endOf("year").toDate();

  // Get orders for the specified year
  const orders = await db.order.findMany({
    where: {
      store_id: ctx.storeId,
      creator_id: ctx.employeeId,
      created_at: {
        gte: startOfYear,
        lte: endOfYear,
      },
    },
    select: {
      created_at: true,
    },
  });

  // Initialize monthly data (0-11 for Jan-Dec)
  const monthlyCount: number[] = new Array(12).fill(0);

  // Aggregate data by month
  orders.forEach((order) => {
    const month = dayjs(order.created_at).month(); // 0-11
    monthlyCount[month] += 1;
  });

  // Calculate totals
  const totalCount = monthlyCount.reduce((sum, val) => sum + val, 0);

  // Get previous year data for comparison
  const previousYearStart = dayjs()
    .year(year - 1)
    .startOf("year")
    .toDate();
  const previousYearEnd = dayjs()
    .year(year - 1)
    .endOf("year")
    .toDate();

  const previousYearOrders = await db.order.aggregate({
    where: {
      store_id: ctx.storeId,
      creator_id: ctx.employeeId,
      created_at: {
        gte: previousYearStart,
        lte: previousYearEnd,
      },
    },
    _count: {
      id: true,
    },
  });

  const previousYearCount = previousYearOrders._count.id || 0;
  const yearOverYearChange =
    previousYearCount > 0
      ? ((totalCount - previousYearCount) / previousYearCount) * 100
      : 0;

  return {
    monthlyCount,
    yearOverYearChange,
    totalCount,
  };
}

export async function getTopSellingProductsData(
  ctx: PermissionContext,
  range: DashboardDateRange,
) {
  type TopSellingGroupResult = {
    product_id: number;
    _sum: {
      count: number | null;
    };
  };

  const data = (await db.orderProduct.groupBy({
    by: ["product_id"],
    where: {
      order: {
        store_id: ctx.storeId,
        created_at: {
          gte: range.start,
          lte: range.end,
        },
      },
    },
    _sum: {
      count: true,
    },
    orderBy: {
      _sum: {
        count: "desc",
      },
    },
    take: 5,
  })) as TopSellingGroupResult[];

  const products = await db.product.findMany({
    where: {
      id: {
        in: data.map((item) => item.product_id),
      },
    },
    select: {
      id: true,
      label: true,
      price: true,
    },
  });

  return data.map((item) => {
    const product = products.find((p) => p.id === item.product_id);
    return {
      id: item.product_id,
      label: product?.label || "Unknown",
      price: product?.price.toNumber() || 0,
      sold: item._sum.count || 0,
    };
  });
}

export async function getRecentOrdersData(ctx: PermissionContext) {
  const order = await db.order.findMany({
    where: {
      creator_id: ctx.userId,
    },
    orderBy: {
      created_at: "desc",
    },
    take: 5,
    select: {
      id: true,
      created_at: true,
      note: true,
      total: true,
    },
  });

  return order.map((item) => ({
    ...item,
    total: item.total.toNumber(),
  }));
}

/**
 * Get count of pending stock receipts (DRAFT, CREATING, PROCESSING)
 * Requires: ProductManagement permission
 */
export async function getPendingStockReceiptCount(ctx: PermissionContext) {
  if (
    !assertStoreCan(ctx, PermissionConfig.store.stock.getReceiptDatatable, {
      throw: false,
    })
  ) {
    return 0;
  }

  return db.stockReceipt.count({
    where: {
      store_id: ctx.storeId,
      status: {
        in: ["DRAFT", "CREATING", "PROCESSING"],
      },
    },
  });
}

/**
 * Get total product count (not deleted)
 * Requires: ProductManagement permission
 */
export async function getTotalProductCount(ctx: PermissionContext) {
  if (
    !assertStoreCan(ctx, PermissionConfig.store.product.getDatatable, {
      throw: false,
    })
  ) {
    return 0;
  }

  return db.product.count({
    where: {
      store_id: ctx.storeId,
      deleted_at: null,
    },
  });
}

/**
 * Get count of active promotions (events that are currently active)
 * Requires: PromotionManagement permission
 */
export async function getActiveEventCount(ctx: PermissionContext) {
  if (
    !assertStoreCan(ctx, PermissionConfig.store.promotion.getDatatable, {
      throw: false,
    })
  ) {
    return 0;
  }

  const now = new Date();

  return db.event.count({
    where: {
      store_id: ctx.storeId,
      disabled_at: null,
      start_at: {
        lte: now,
      },
      end_at: {
        gte: now,
      },
    },
  });
}

/**
 * Get auth (current user) sales count
 * No permission required - everyone can see their own sales
 */
export async function getAuthSalesCount(
  ctx: PermissionContext,
  range?: DashboardDateRange,
) {
  const whereClause: {
    store_id: string | undefined;
    creator_id: number;
    created_at?: {
      gte: Date;
      lte: Date;
    };
  } = {
    store_id: ctx.storeId,
    creator_id: ctx.userId,
  };

  if (range) {
    whereClause.created_at = {
      gte: range.start,
      lte: range.end,
    };
  }

  const result = await db.orderProduct.aggregate({
    where: {
      order: whereClause,
    },
    _sum: {
      count: true,
    },
  });

  return result._sum.count ?? 0;
}

/**
 * Get store sales count today
 * Requires: HistoryReadAll permission
 */
export async function getStoreSalesCountToday(ctx: PermissionContext) {
  if (
    !assertStoreCan(ctx, PermissionConfig.store.dashboard.viewOrderSoldStat, {
      throw: false,
    })
  ) {
    return 0;
  }

  const todayStart = dayjs().startOf("day").toDate();
  const todayEnd = dayjs().endOf("day").toDate();

  const result = await db.orderProduct.aggregate({
    where: {
      order: {
        store_id: ctx.storeId,
        created_at: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    },
    _sum: {
      count: true,
    },
  });

  return result._sum.count ?? 0;
}
