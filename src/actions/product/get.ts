"use server";
import { TableFetch } from "@/components/Datatable";
import { ProductPermissionEnum } from "@/enums/permission";
import db from "@/libs/db";
import { getUser } from "@/libs/session";

const GetProducts = async (table: TableFetch) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    if (!user.hasPermission(ProductPermissionEnum.READ))
      throw new Error("Forbidden");
    const datatable = await db.product.datatableFetch({
      table: table,
      filter: ["serial", "label", "keywords"],
      include: {
        category: {
          select: {
            label: true,
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
        stock: {
          select: {
            quantity: true,
          },
        },
      },
      where: {
        store_id: user.store,
        deleted_at: null,
      },
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

export default GetProducts;
