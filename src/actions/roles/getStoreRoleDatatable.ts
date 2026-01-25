"use server";
import { TableFetch } from "@/components/Datatable";
import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";

export const getRoleDatatable = async (table: TableFetch) => {
  try {
    const ctx = await getPermissionContext(table.storeIdentifier);
    assertStoreCan(ctx, PermissionConfig.store.role.datatable);

    const { data, total } = await db.storeRole.getDatatable({
      query: table,
      where: {
        store_id: ctx.storeId!,
      },
      searchable: {
        name: {
          mode: "insensitive",
        },
        description: {
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        created_at: true,
        name: true,
        description: true,
        permissions: true,
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
      },
    });

    return {
      success: true,
      data: data,
      total: total,
    };
  } catch (error) {
    console.log(`getRowDatatable error : `, error);
    return {
      success: false,
      data: [],
      total: 0,
    };
  }
};
