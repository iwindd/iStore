"use server";

import { HistoryPermissionEnum } from "@/enums/permission";
import db from "@/libs/db";
import { User } from "@/libs/user";
import {
  DashboardRange,
  EnumDashboardRange,
} from "@/reducers/dashboardReducer";

import { Method, PreOrderStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import dayjs from "dayjs";

export async function getSoldSummary(user: User, range: DashboardDateRange) {
  const orderProductCount = await db.orderProduct.aggregate({
    where: {
      order: {
        creator_id: user.limitPermission(HistoryPermissionEnum.READ),
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
  user: User,
  range: DashboardDateRange
) {
  type PreorderGroupResult = {
    status: PreOrderStatus;
    _sum: { count: number | null };
  };

  const preorderSummary = (await db.orderPreOrder.groupBy({
    by: ["status"],
    where: {
      order: {
        creator_id: user.limitPermission(HistoryPermissionEnum.READ),
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
  user: User,
  range: DashboardDateRange
) {
  return db.consignment.count({
    where: {
      store_id: user.store,
      creator_id: user.limitPermission(HistoryPermissionEnum.READ),
      created_at: {
        gte: range.start,
        lte: range.end,
      },
    },
  });
}

export async function getProductSummary(user: User) {
  const lowStockCount = await db.productStock.count({
    where: {
      product: {
        store_id: user.store,
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
  user: User,
  range: DashboardDateRange
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
      creator_id: user.limitPermission(HistoryPermissionEnum.READ),
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
