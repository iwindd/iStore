"use server";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { Prisma } from "@prisma/client";

export type FindProductBySerialResult = Prisma.ProductGetPayload<{
  select: {
    id: true;
    serial: true;
    label: true;
    price: true;
    cost: true;
    stock: {
      select: {
        quantity: true;
      };
    };
    category: {
      select: {
        label: true;
        overstock: true;
      };
    };
  };
}>;

const findProductBySerial = async (
  serial: string,
  includeDelete?: boolean
): Promise<ActionResponse<FindProductBySerialResult | null>> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    const product = await db.product.findFirst({
      where: {
        serial: serial,
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
        stock: {
          select: {
            quantity: true,
          },
        },
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
    return ActionError(
      error
    ) as ActionResponse<FindProductBySerialResult | null>;
  }
};

export default findProductBySerial;
