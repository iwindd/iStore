"use server";
import { TableFetch } from "@/components/Datatable";
import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { parseKeywords } from "@/libs/utils";
import { Prisma } from "@prisma/client";

export type ProductDatatableInstance = Awaited<
  ReturnType<typeof getProductDatatable>
>["data"][number];

const getProductDatatable = async (
  table: TableFetch,
  filterType?: "all" | "preorder" | "outOfStock" | "stock" | "deleted",
) => {
  const ctx = await getPermissionContext(table.storeIdentifier);
  assertStoreCan(ctx, PermissionConfig.store.product.getDatatable);

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
      data: datatable.data.map((item) => ({
        ...item,
        price: item.price.toNumber(),
        cost: item.cost.toNumber(),
        keywords: parseKeywords(item.keywords),
      })),
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
