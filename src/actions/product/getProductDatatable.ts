"use server";
import { TableFetch } from "@/components/Datatable";
import { ProductPermissionEnum } from "@/enums/permission";
import db from "@/libs/db";
import { getUser } from "@/libs/session";

export type ProductDatatableInstance = Awaited<
  ReturnType<typeof getProductDatatable>
>["data"][number];

const getProductDatatable = async (
  table: TableFetch,
  filterType?: "all" | "preorder" | "outOfStock" | "stock" | "deleted",
) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    if (!user.hasPermission(ProductPermissionEnum.READ))
      throw new Error("Forbidden");

    let where: any = {
      store_id: user.store,
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
            name: {
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
        creator: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
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
    console.error(error);
    return {
      success: true,
      data: [],
      total: 0,
    };
  }
};

export default getProductDatatable;
