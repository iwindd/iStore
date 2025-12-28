"use server";
import db from "@/libs/db";
import { validateApiKey } from "@/libs/validateApiKey";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

const getPromotionOffers = async (storeId: string) => {
  const now = new Date();
  const select = {
    id: true,
    event: {
      select: {
        title: true,
        description: true,
        start_at: true,
        end_at: true,
      },
    },
    buyItems: {
      select: {
        quantity: true,
        product: {
          select: {
            label: true,
          },
        },
      },
    },
    getItems: {
      select: {
        quantity: true,
        product: {
          select: {
            label: true,
          },
        },
      },
    },
  };
  const result = (await db.promotionOffer.findMany({
    where: {
      event: {
        store_id: storeId,
        start_at: {
          lte: now,
        },
        end_at: {
          gte: now,
        },
        disabled_at: null,
      },
    },
    orderBy: [
      {
        event: {
          disabled_at: "desc",
        },
      },
      { updated_at: "desc" },
      { created_at: "desc" },
    ],
    select,
  })) as unknown as Prisma.PromotionOfferGetPayload<{
    select: typeof select;
  }>[];

  return result.map((promotion) => ({
    id: promotion.id,
    ...promotion.event,
    type: "buyXgetY",
    buy: promotion.buyItems,
    receive: promotion.getItems,
  }));
};

export async function GET(request: Request) {
  const authResult = await validateApiKey(request);

  if (!authResult.valid) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  const result = await getPromotionOffers(authResult.storeId!);
  // Return a JSON response
  return NextResponse.json(result, { status: 200 });
}
