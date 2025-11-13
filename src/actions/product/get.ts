"use server";
import { TableFetch } from "@/components/Datatable";
import { ProductPermissionEnum } from "@/enums/permission";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { Product } from "@prisma/client";

const GetProducts = async (
  table: TableFetch
): Promise<ActionResponse<Product[]>> => {
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
    console.log("catch", error);

    return ActionError(error) as ActionResponse<Product[]>;
  }
};

export default GetProducts;
