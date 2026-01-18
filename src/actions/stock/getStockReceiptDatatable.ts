"use server";
import { TableFetch } from "@/components/Datatable";
import { StockPermissionEnum } from "@/enums/permission";
import { ActionError } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { Prisma } from "@prisma/client";

export type StockReceiptDatatableInstance = Prisma.StockReceiptGetPayload<{
  select: {
    id: true;
    action_at: true;
    note: true;
    status: true;
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
    stock_recept_products: {
      select: {
        quantity: true;
      };
    };
    _count: {
      select: {
        stock_recept_products: true;
      };
    };
  };
}>;

const getStockReceiptDatatable = async (
  query: TableFetch,
  filterType?: "all" | "completed" | "draft" | "cancelled",
) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    let where: any = {
      store_id: user.store,
      creator_id: user.limitPermission(StockPermissionEnum.READ),
    };

    if (filterType === "completed") {
      where.status = "COMPLETED";
    } else if (filterType === "draft") {
      where.status = { in: ["DRAFT", "CREATING", "PROCESSING"] };
    } else if (filterType === "cancelled") {
      where.status = "CANCEL";
    }

    return await db.stockReceipt.getDatatable({
      query,
      where,
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
        stock_recept_products: {
          select: {
            quantity: true,
          },
        },
        _count: {
          select: {
            stock_recept_products: true,
          },
        },
      },
      searchable: {
        creator: {
          user: {
            name: {
              mode: "insensitive",
            },
          },
        },
        note: {
          mode: "insensitive",
        },
      },
    });
  } catch (error) {
    console.error(error);
    return ActionError(error);
  }
};

export default getStockReceiptDatatable;
