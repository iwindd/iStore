"use server";

import { HistoryFilter } from "@/app/projects/[store]/(store)/histories/types";
import { TableFetch } from "@/components/Datatable";
import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";
import {
  assertStore,
  ifNotHasStorePermission,
} from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { Prisma } from "@prisma/client";

const getHistoryDatatable = async (
  table: TableFetch,
  filter?: HistoryFilter,
) => {
  try {
    const ctx = await getPermissionContext(table.storeIdentifier);
    assertStore(ctx);

    // Build where clause with filters
    const where: Prisma.OrderWhereInput = {
      store_id: ctx.storeId!,
      creator_id: ifNotHasStorePermission(
        ctx,
        PermissionConfig.store.history.readAllUser,
      ),
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

    const { data, total } = await db.order.getDatatable({
      query: table,
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
                first_name: true,
                last_name: true,
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
      searchable: {
        note: { mode: "insensitive" },
        products: {
          some: {
            product: {
              serial: { mode: "insensitive" },
              label: { mode: "insensitive" },
            },
          },
        },
        preOrders: {
          some: {
            product: {
              serial: { mode: "insensitive" },
              label: { mode: "insensitive" },
            },
          },
        },
        creator: {
          user: {
            first_name: { mode: "insensitive" },
            last_name: { mode: "insensitive" },
          },
        },
      },
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
