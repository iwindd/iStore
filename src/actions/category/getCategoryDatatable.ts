"use server";
import { TableFetch } from "@/components/Datatable";
import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";

const getCategoryDatatable = async (table: TableFetch) => {
  try {
    const ctx = await getPermissionContext(table.storeIdentifier);
    assertStoreCan(ctx, PermissionConfig.store.category.getDatatable);

    const datatable = await db.category.getDatatable({
      query: table,
      searchable: {
        label: {
          mode: "insensitive",
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
        label: true,
        created_at: true,
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
        _count: {
          select: {
            product: true,
          },
        },
      },
      where: {
        store_id: ctx.storeId!,
      },
    });

    return {
      success: true,
      data: datatable.data,
      total: datatable.total,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      data: [],
      total: 0,
    };
  }
};

export default getCategoryDatatable;
