"use server";

import db from "@/libs/db";
import { PermissionContext } from "@/libs/permission/context";
import {
  DashboardRange,
  EnumDashboardRange,
} from "@/reducers/dashboardReducer";

import { Method, PreOrderStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import dayjs from "dayjs";

export async function getSoldSummary(
  ctx: PermissionContext,
  range: DashboardDateRange,
) {
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

  const data = (await db.order.groupBy({
    by: ["method"],
    where: {
      store_id: ctx.storeId,
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
      methodCash.percent = (row._count.id / totalOrders) * 100;
      methodCash.count = row._sum.total.toNumber();
    }
    if (row.method === Method.BANK) {
      methodBank.percent = (row._count.id / totalOrders) * 100;
      methodBank.count = row._sum.total.toNumber();
    }
  }

  const result = [methodCash, methodBank];
  return result;
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
