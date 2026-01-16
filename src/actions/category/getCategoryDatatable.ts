"use server";
import { TableFetch } from "@/components/Datatable";
import { CategoryPermissionEnum } from "@/enums/permission";
import db from "@/libs/db";
import { filter, order } from "@/libs/formatter";
import { getUser } from "@/libs/session";

const getCategoryDatatable = async (table: TableFetch) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    if (!user.hasPermission(CategoryPermissionEnum.READ))
      throw new Error("Forbidden");
    const categories = await db.$transaction([
      db.category.findMany({
        skip: table.pagination.page * table.pagination.pageSize,
        take: table.pagination.pageSize,
        orderBy: order(table.sort),
        where: {
          ...filter(table.filter, ["label"]),
          store_id: user.store,
        },
        include: {
          _count: {
            select: {
              product: true,
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
      }),
      db.category.count({
        where: {
          store_id: user.store,
        },
      }),
    ]);

    return {
      success: true,
      data: categories[0],
      total: categories[1],
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
