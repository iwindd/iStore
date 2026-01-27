"use server";

import { TableFetch } from "@/components/Datatable";
import db from "@/libs/db";

const getUserDatatable = async (payload: TableFetch) => {
  /*   const ctx = await getPermissionContext();
  assertGlobalCan(ctx, PermissionConfig.user.getUsers);
   */
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
