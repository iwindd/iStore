"use server";
import { TableFetch } from "@/components/Datatable";
import { ActionError } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
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
            name: true;
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
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    return await db.consignment.datatableFetch({
      table,
      where: {
        store_id: user.store,
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
                name: true,
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
  } catch (error) {
    console.error(error);
    return ActionError(error);
  }
};

export default fetchConsignmentDatatable;
