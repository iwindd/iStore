"use server";
import { getJsonPrompt, parseJson } from "@/libs/ai";
import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import z from "zod";

const generatePromotionOfferInfo = async (
  buyProducts: { label: string; quantity: number }[],
  getProducts: { label: string; quantity: number }[]
) => {
  const validatedBuyProducts = buyProducts.map((p) => ({
    label: p.label,
    quantity: Number(p.quantity),
  }));
  const validatedGetProducts = getProducts.map((p) => ({
    label: p.label,
    quantity: Number(p.quantity),
  }));

  const { text } = await generateText({
    model: groq("llama-3.3-70b-versatile"),
    prompt: getJsonPrompt(
      "คุณเป็นผู้เชี่ยวชาญด้านการตลาด เขียนข้อความประชาสัมพันธ์โปรโมชั่นแบบกระชับและดึงดูดใจ",
      [
        `ซื้อ: ${JSON.stringify(validatedBuyProducts, null, 2)}`,
        `รับฟรี: ${JSON.stringify(validatedGetProducts, null, 2)}`,
      ],
      [
        "ใช้ภาษาไทย",
        "ชื่อโปรโมชั่น ≤ 100 ตัวอักษร",
        "รายละเอียดโปรโมชั่น ≤ 200 ตัวอักษร",
        "เขียนให้น่าสนใจ ใช้ emoji ได้",
        "ห้ามใส่ markdown, ห้ามใส่ backticks, ห้ามใส่คำอธิบายนอก JSON",
      ],
      ["title", "description"]
    ),
    temperature: 0.7,
  });

  return parseJson(
    text,
    z.object({
      title: z.string().max(100),
      description: z.string().max(200),
    })
  ) as {
    title: string;
    description: string;
  };
};

export default generatePromotionOfferInfo;
