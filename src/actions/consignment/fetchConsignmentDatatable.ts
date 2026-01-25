"use server";
import { TableFetch } from "@/components/Datatable";
import { StorePermissionEnum } from "@/enums/permission";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { Prisma } from "@prisma/client";

export type ConsignmentDatatableInstance = Prisma.ConsignmentGetPayload<{
  select: {
    id: true;
    status: true;
    note: true;
    created_at: true;
    creator: {
      select: {
        user: {
          select: {
            first_name: true;
            last_name: true;
          };
        };
      };
    };
    _count: {
      select: {
        products: true;
      };
    };
  };
}>;

const fetchConsignmentDatatable = async (table: TableFetch) => {
  const ctx = await getPermissionContext(table.storeIdentifier);
  assertStoreCan(ctx, StorePermissionEnum.CONSIGNMENT_MANAGEMENT);

  return await db.consignment.getDatatable({
    query: table,
    where: {
      store_id: ctx.storeId!,
    },
    select: {
      id: true,
      status: true,
      note: true,
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
          products: true,
        },
      },
    },
  });
};

export default fetchConsignmentDatatable;
