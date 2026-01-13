"use server";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { removeWhiteSpace } from "@/libs/formatter";
import { getUser } from "@/libs/session";
import { Product } from "@prisma/client";

const GetProduct = async (
  serial: string,
  includeDelete?: boolean
): Promise<ActionResponse<Product | null>> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    const product = await db.product.findFirst({
      where: {
        serial: removeWhiteSpace(serial),
        store_id: user.store,
        ...(includeDelete ? {} : { deleted_at: null }),
      },
      include: {
        category: {
          select: {
            overstock: true,
          },
        },
      },
    });

    return {
      success: true,
      data: product,
    };
  } catch (error) {
    return ActionError(error) as ActionResponse<Product | null>;
  }
};

export default GetProduct;
