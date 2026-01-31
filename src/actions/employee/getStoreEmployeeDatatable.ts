"use server";
import { TableFetch } from "@/components/Datatable";
import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";

const getStoreEmployeeDatatable = async (table: TableFetch) => {
  try {
    const ctx = await getPermissionContext(table.storeIdentifier);
    assertStoreCan(ctx, PermissionConfig.store.employee.datatable);

    const datatable = await db.user.getDatatable({
      query: table,
      where: {
        employees: {
          some: {
            store_id: ctx.storeId!,
          },
        },
        id: {
          not: ctx.employeeId,
        },
      },
      searchable: {
        first_name: {
          mode: "insensitive",
        },
        last_name: {
          mode: "insensitive",
        },
        email: {
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        employees: {
          take: 1,
          where: {
            store_id: ctx.storeId!,
          },
          select: {
            id: true,
            role: {
              select: {
                id: true,
                name: true,
              },
            },
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
          },
        },
      },
    });

    return {
      success: true,
      data: datatable.data,
      total: datatable.total,
    };
  } catch (error) {
    console.error(`getStoreEmployeeDatatable error : ${error}`);
    return {
      success: false,
      data: [],
      total: 0,
    };
  }
};

export default getStoreEmployeeDatatable;
