"use server";

import { TableFetch } from "@/components/Datatable";
import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";
import { assertGlobalCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";

const getUserDatatable = async (payload: TableFetch) => {
  const ctx = await getPermissionContext();
  assertGlobalCan(ctx, PermissionConfig.global.user.getUsers);

  const datatable = db.user.getDatatable({
    query: payload,
    searchable: {
      first_name: { mode: "insensitive" },
      last_name: { mode: "insensitive" },
      email: { mode: "insensitive" },
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      created_at: true,
      employees: {
        include: {
          store: {
            select: {
              id: true,
              name: true,
            },
          },
          role: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  return datatable;
};

export default getUserDatatable;
