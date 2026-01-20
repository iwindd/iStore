import db from "@/libs/db";
import { AssistantAgentContext } from "@/mastra/agents/assistant-agent";
import { createTool } from "@mastra/core/tools";
import { unstable_cache } from "next/cache";
import { z } from "zod";

const getProducts = unstable_cache(
  async (storeId: string) => {
    console.log(`Querying products for storeId: ${storeId}`);

    const products = await db.product.findMany({
      where: {
        store_id: storeId,
        deleted_at: null,
      },
      select: {
        label: true,
        created_at: true,
        price: true,
        stock: {
          select: {
            quantity: true,
          },
        },
        _count: {
          select: {
            orderProduct: true,
          },
        },
      },
    });

    const allCount = products.reduce(
      (acc, p) => acc + p._count.orderProduct,
      0,
    );

    const result = products.map((p) => ({
      label: p.label,
      rate: p._count.orderProduct / allCount,
      price: p.price,
      createdAt: p.created_at,
      stockCount: p.stock?.quantity || 0,
    }));

    return result;
  },
  ["store-products"], // key parts
  { revalidate: 12 * 60 * 60 }, // 12 hours
);

export const getProductsTool = createTool({
  id: "get-products",
  description:
    "ดึงรายชื่อสินค้าทั้งหมดที่ขายในร้านค้า พร้อมข้อมูลยอดขายและสินค้าแนะนำ",
  outputSchema: z.array(
    z.object({
      label: z.string(),
      createdAt: z.date().describe("วันที่สร้างสินค้า"),
      rate: z.number().describe("ค่าความนิยมของสินค้า"),
      price: z.number().describe("ราคาสินค้า"),
      stockCount: z.number().describe("จำนวนสินค้าคงเหลือ"),
    }),
  ),
  execute: async ({ runtimeContext }) => {
    const storeIdFromRuntime: AssistantAgentContext["storeId"] =
      runtimeContext.get("storeId");

    console.log(`Getting products for storeId: ${storeIdFromRuntime}`);
    return getProducts(storeIdFromRuntime);
  },
});
