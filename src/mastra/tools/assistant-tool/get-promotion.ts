import db from "@/libs/db";
import { AssistantAgentContext } from "@/mastra/agents/assistant-agent";
import { createTool } from "@mastra/core/tools";
import { Prisma } from "@prisma/client";
import { z } from "zod";

export const getPromotionTool = createTool({
  id: "get-promotion",
  description: "ดึงข้อมูลโปรโมชั่น ส่วนลด ของร้านค้า",
  outputSchema: z.array(
    z.object({
      promotionType: z.enum(["buyXgetY"]),
      startAt: z.date(),
      endAt: z.date(),
      whenBuy: z.array(
        z.object({
          name: z.string(),
          quantity: z.number(),
        }),
      ),
      willGetFree: z.array(
        z.object({
          name: z.string(),
          quantity: z.number(),
        }),
      ),
    }),
  ),
  execute: async ({ runtimeContext }) => {
    const storeIdFromRuntime: AssistantAgentContext["storeId"] =
      runtimeContext.get("storeId");

    console.log(`Getting promotion for storeId: ${storeIdFromRuntime}`);
    return await getPromotion(storeIdFromRuntime);
  },
});

const getPromotion = async (storeId: string) => {
  const select = Prisma.validator<Prisma.PromotionOfferSelect>()({
    event: {
      select: {
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
  });

  const rows = await db.promotionOffer.findMany({
    select,
    where: {
      event: {
        store_id: storeId,
        start_at: {
          lte: new Date(),
        },
        end_at: {
          gte: new Date(),
        },
        disabled_at: null,
      },
    },
  });

  const promotions = rows.map((row) => ({
    promotionType: "buyXgetY" as const,
    startAt: row.event.start_at,
    endAt: row.event.end_at,
    whenBuy: row.buyItems.map((i) => ({
      name: i.product.label,
      quantity: i.quantity,
    })),
    willGetFree: row.getItems.map((i) => ({
      name: i.product.label,
      quantity: i.quantity,
    })),
  }));

  return promotions;
};
