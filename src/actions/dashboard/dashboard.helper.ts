"use server";

import { HistoryPermissionEnum } from "@/enums/permission";
import db from "@/libs/db";
import { User } from "@/libs/user";
import {
  DashboardRange,
  EnumDashboardRange,
} from "@/reducers/dashboardReducer";
import { PreOrderStatus } from "@prisma/client";
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

export type DashboardDateRange = {
  start: Date;
  end: Date;
};

export async function getDashboardRangeDate(range: DashboardRange) {
  try {
    switch (range) {
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
