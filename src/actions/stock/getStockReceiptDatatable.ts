"use server";
import { TableFetch } from "@/components/Datatable";
import { StorePermissionEnum } from "@/enums/permission";
import { ActionError } from "@/libs/action";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
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
            first_name: true;
            last_name: true;
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
    const ctx = await getPermissionContext(query.storeIdentifier);
    assertStoreCan(ctx, StorePermissionEnum.PRODUCT_MANAGEMENT);

    let where: any = {
      store_id: ctx.storeId,
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
                first_name: true,
                last_name: true,
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
            first_name: {
              mode: "insensitive",
            },
            last_name: {
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
