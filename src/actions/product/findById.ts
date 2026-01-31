"use server";
import { PermissionConfig } from "@/config/permissionConfig";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { Prisma } from "@prisma/client";

export type FindProductByIdResult = Prisma.ProductGetPayload<{
  select: {
    id: true;
    serial: true;
    label: true;
    price: true;
    cost: true;
    usePreorder: true;
    stock: {
      select: {
        quantity: true;
      };
    };
    category: {
      select: {
        label: true;
      };
    };
  };
}>;

const findProductById = async (
  storeSlug: string,
  id: number,
): Promise<ActionResponse<FindProductByIdResult | null>> => {
  try {
    const ctx = await getPermissionContext(storeSlug);
    assertStoreCan(ctx, PermissionConfig.store.cashier.cashout);
    const product = await db.product.findFirst({
      where: {
        id: id,
        store_id: ctx.storeId!,
      },
      select: {
        id: true,
        serial: true,
        label: true,
        price: true,
        cost: true,
        usePreorder: true,
        stock: {
          select: {
            quantity: true,
          },
        },
        category: {
          select: {
            label: true,
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
