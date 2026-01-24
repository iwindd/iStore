"use server";
import { TableFetch } from "@/components/Datatable";
import db from "@/libs/db";
import { Prisma } from "@prisma/client";

export type ProductDatatableInstance = Awaited<
  ReturnType<typeof getProductDatatable>
>["data"][number];

const getProductDatatable = async (
  table: TableFetch,
  filterType?: "all" | "preorder" | "outOfStock" | "stock" | "deleted",
) => {
  try {
    let where: Prisma.ProductWhereInput = {
      store: {
        slug: table.storeIdentifier,
      },
      deleted_at: null,
    };

    if (filterType === "preorder") {
      where.usePreorder = true;
    } else if (filterType === "outOfStock") {
      where.stock = { quantity: { lte: 0 } };
    } else if (filterType === "stock") {
      where.stock = { quantity: { gt: 0 } };
    } else if (filterType === "deleted") {
      where.deleted_at = { not: null };
    }

    const datatable = await db.product.getDatatable({
      query: table,
      searchable: {
        serial: {
          mode: "insensitive",
        },
        label: {
          mode: "insensitive",
        },
        keywords: {
          mode: "insensitive",
        },
        category: {
          label: {
            mode: "insensitive",
          },
        },
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
      },
      select: {
        id: true,
        serial: true,
        label: true,
        keywords: true,
        price: true,
        cost: true,
        sold: true,
        usePreorder: true,
        category: {
          select: {
            label: true,
          },
        },
        stock: {
          select: {
            quantity: true,
            useAlert: true,
            alertCount: true,
          },
        },
        deleted_at: true,
      },
      where,
    });

    return {
      success: true,
      ...datatable,
    };
  } catch (error) {
    console.error("getProductDatatable error:", error);
    return {
      success: true,
      data: [],
      total: 0,
    };
  }
};

export default getProductDatatable;
