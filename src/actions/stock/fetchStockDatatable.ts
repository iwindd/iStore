"use server";
import { TableFetch } from "@/components/Datatable";
import { StockPermissionEnum } from "@/enums/permission";
import { ActionError } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { Prisma } from "@prisma/client";

export type StockDatatableInstance = Prisma.StockReceiptGetPayload<{
  select: {
    id: true;
    action_at: true;
    note: true;
    state: true;
    creator: {
      select: {
        id: true;
        user: {
          select: {
            name: true;
          };
        };
      };
    };
    _count: {
      select: {
        stock_recept_products: true;
      };
    };
  };
}>;

const fetchStockDatatable = async (table: TableFetch) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    return await db.stockReceipt.datatableFetch({
      table,
      where: {
        store_id: user.store,
        creator_id: user.limitPermission(StockPermissionEnum.READ),
      },
      select: {
        id: true,
        action_at: true,
        note: true,
        status: true,
        creator: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            stock_recept_products: true,
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
    return ActionError(error);
  }
};

export default fetchStockDatatable;
