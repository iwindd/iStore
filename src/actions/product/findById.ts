"use server";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { Prisma } from "@prisma/client";

export type FindProductByIdResult = Prisma.ProductGetPayload<{
  select: {
    id: true;
    serial: true;
    label: true;
    price: true;
    cost: true;
    stock: true;
    category: {
      select: {
        label: true;
        overstock: true;
      };
    };
  };
}>;

const findProductById = async (
  id: number,
  includeDelete?: boolean
): Promise<ActionResponse<FindProductByIdResult | null>> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    const product = await db.product.findFirst({
      where: {
        id: id,
        store_id: user.store,
        ...(includeDelete
          ? {}
          : {
              deleted_at: null,
            }),
      },
      select: {
        id: true,
        serial: true,
        label: true,
        price: true,
        cost: true,
        stock: true,
        category: {
          select: {
            label: true,
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
    return ActionError(error) as ActionResponse<FindProductByIdResult | null>;
  }
};

export default findProductById;
