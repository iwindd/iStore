"use server";
import { TableFetch } from "@/components/Datatable";
import { StorePermissionEnum } from "@/enums/permission";
import { ActionError } from "@/libs/action";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { DatatableFetchResult } from "@/libs/prismaExtensions/Datatable";
import { Prisma } from "@prisma/client";

export type BroadcastDatatableInstance = Prisma.BroadcastGetPayload<{
  select: {
    id: true;
    title: true;
    message: true;
    image_url: true;
    scheduled_at: true;
    sent_at: true;
    status: true;
    created_at: true;
    event: {
      select: {
        id: true;
        note: true;

        start_at: true;
        end_at: true;
      };
    };
    creator: {
      select: {
        user: {
          select: {
            name: true;
          };
        };
      };
    };
  };
}>;

const fetchBroadcastDatatable = async (
  table: TableFetch,
): Promise<DatatableFetchResult<BroadcastDatatableInstance>> => {
  try {
    const ctx = await getPermissionContext(table.storeIdentifier);
    assertStoreCan(ctx, StorePermissionEnum.BROADCAST_MANAGEMENT);
    const result = await db.broadcast.datatableFetch({
      table,
      where: {
        store_id: ctx.storeId,
      },
      orderBy: [{ scheduled_at: "desc" }, { created_at: "desc" }],
      select: {
        id: true,
        title: true,
        message: true,
        image_url: true,
        scheduled_at: true,
        sent_at: true,
        status: true,
        created_at: true,
        event: {
          select: {
            id: true,
            note: true,

            start_at: true,
            end_at: true,
          },
        },
        creator: {
          select: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return result;
  } catch (error) {
    console.error(error);
    throw ActionError(error);
  }
};

export default fetchBroadcastDatatable;
