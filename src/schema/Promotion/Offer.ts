import z from "zod";

const ProductQuantitySchema = z.object({
  product_id: z.number(),
  quantity: z.number().int().min(1),
});

export const AddPromotionOfferSchema = z
  .object({
    name: z.string().min(6).max(100),
    note: z.string().max(255).optional(),
    start_at: z.date(),
    end_at: z.date(),
    needProducts: z
      .array(ProductQuantitySchema)
      .min(1, "โปรดเพิ่มสินค้าที่ต้องซื้ออย่างน้อย 1 รายการ"),
    offerProducts: z
      .array(ProductQuantitySchema)
      .min(1, "โปรดเพิ่มสินค้าที่ต้องเสนออย่างน้อย 1 รายการ"),
  })
  .refine((data) => data.end_at > data.start_at, {
    message: "วันสิ้นสุดต้องอยู่หลังวันเริ่มต้น",
    path: ["end_at"],
  })
  .refine(
    (data) => {
      const productIds = data.needProducts
        .map((p) => p.product_id)
        .filter((id) => id > 0);
      return new Set(productIds).size === productIds.length;
    },
    {
      message: "ไม่สามารถเพิ่มสินค้าซ้ำกันได้",
      path: ["needProducts"],
    },
  )
  .refine(
    (data) => {
      const productIds = data.offerProducts
        .map((p) => p.product_id)
        .filter((id) => id > 0);
      return new Set(productIds).size === productIds.length;
    },
    {
      message: "ไม่สามารถเพิ่มสินค้าซ้ำกันได้",
      path: ["offerProducts"],
    },
  );

export type AddPromotionOfferValues = z.infer<typeof AddPromotionOfferSchema>;

export const UpdatePromotionOfferSchema = AddPromotionOfferSchema;
export type UpdatePromotionOfferValues = z.infer<
  typeof UpdatePromotionOfferSchema
>;
