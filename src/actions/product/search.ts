"use server";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { removeWhiteSpace } from "@/libs/formatter";
import { getUser } from "@/libs/session";
import { Prisma } from "@prisma/client";

export interface SearchProduct {
  id: number;
  serial: string;
  stock: {
    quantity: number;
  };
  label: string;
}

const SearchProducts = async (
  input: string
): Promise<ActionResponse<SearchProduct[]>> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    const where: Prisma.ProductWhereInput = {
      OR: [
        { label: { contains: input } },
        { serial: { contains: removeWhiteSpace(input) } },
        { keywords: { contains: input } },
      ],
      store_id: user.store,
    };

    const products = await db.product.findMany({
      take: 5,
      orderBy: {
        sold: "desc",
      },
      where,
      select: {
        id: true,
        serial: true,
        label: true,
        stock: {
          select: {
            quantity: true,
          },
        },
      },
    });

    return {
      success: true,
      data: products.map((product) => ({
        ...product,
        stock: {
          quantity: product.stock?.quantity || 0,
        },
      })),
    };
  } catch (error) {
    return ActionError(error) as ActionResponse<SearchProduct[]>;
  }
};

export default SearchProducts;
