"use server";

import { HistoryFilter } from "@/app/(store)/histories/types";
import { TableFetch } from "@/components/Datatable";
import { HistoryPermissionEnum } from "@/enums/permission";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { Prisma } from "@prisma/client";

const getHistoryDatatable = async (
  table: TableFetch,
  filter?: HistoryFilter,
) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    // Build where clause with filters
    const where: Prisma.OrderWhereInput = {
      store_id: user.store,
      creator_id: user.limitPermission(HistoryPermissionEnum.READ),
    };

    // Date range filter
    if (filter?.startDate || filter?.endDate) {
      where.created_at = {};
      if (filter.startDate) {
        where.created_at.gte = new Date(filter.startDate);
      }
      if (filter.endDate) {
        where.created_at.lte = new Date(filter.endDate);
      }
    }

    // Payment method filter
    if (filter?.method) {
      where.method = filter.method;
    }

    // Creator filter
    if (filter?.creatorId) {
      where.creator_id = filter.creatorId;
    }

    // Total range filter
    if (filter?.minTotal !== undefined && filter?.minTotal !== null) {
      where.total = { ...(where.total as object), gte: filter.minTotal };
    }
    if (filter?.maxTotal !== undefined && filter?.maxTotal !== null) {
      where.total = { ...(where.total as object), lte: filter.maxTotal };
    }

    // Has note filter
    if (filter?.hasNote === true) {
      where.note = { not: null };
    } else if (filter?.hasNote === false) {
      where.note = null;
    }

    const { data, total } = await db.order.datatableFetch({
      table: table,
      filter: ["note"],
      select: {
        id: true,
        total: true,
        cost: true,
        profit: true,
        note: true,
        method: true,
        created_at: true,
        consignment_id: true,
        products: {
          take: 3,
          select: {
            count: true,
            product: {
              select: {
                label: true,
              },
            },
          },
        },
        creator: {
          select: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        consignment: {
          select: {
            id: true,
            status: true,
          },
        },
      },
      where,
    });

    return {
      data: data.map((order: any) => ({
        ...order,
        total: Number(order.total),
        cost: Number(order.cost),
        profit: Number(order.profit),
      })),
      total,
    };
  } catch (error) {
    console.error(error);
    return { data: [], total: 0 };
  }
};

export default getHistoryDatatable;
