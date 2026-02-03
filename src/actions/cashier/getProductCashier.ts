"use server";
import { TableFetch } from "@/components/Datatable";
import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { Prisma } from "@prisma/client";

export type ProductCashierInstance = Awaited<
  ReturnType<typeof getProductCashier>
>["data"][number];

const getProductCashier = async (table: TableFetch) => {
  const ctx = await getPermissionContext(table.storeIdentifier);
  assertStoreCan(ctx, PermissionConfig.store.cashier.getProductCashier);

  try {
    let where: Prisma.ProductWhereInput = {
      store: {
        slug: table.storeIdentifier,
      },
      deleted_at: null,
    };

    const datatable = await db.product.getDatatable({
      query: {
        ...table,
        sort: [
          {
            field: "stock.quantity",
            sort: "asc",
          },
          {
            field: "category.label",
            sort: "asc",
          },
          ...table.sort,
        ],
      },
      searchable: {
        serial: {
          mode: "insensitive",
        },
        label: {
          mode: "insensitive",
        },
        keywords: {
          hasSome: [],
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
      data: datatable.data.map((product) => ({
        ...product,
        price: product.price.toNumber(),
        cost: product.cost.toNumber(),
      })),
    };
  } catch (error) {
    console.error("getProductCashier error:", error);
    return {
      success: true,
      data: [],
      total: 0,
    };
  }
};

export default getProductCashier;
