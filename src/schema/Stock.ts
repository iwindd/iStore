import z from "zod";

export const StockSchema = z
  .object({
    note: z.string().max(255),
    products: z
      .array(
        z.object({
          product_id: z.number().min(1, "Product is required"),
          delta: z.number().min(1, "Delta is required"),
        })
      )
      .min(1),
    update: z.boolean().default(false),
  })
  .required();

export type StockValues = z.infer<typeof StockSchema>;
