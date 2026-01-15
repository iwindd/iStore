import { z } from "zod";

export const ConsignmentSchema = z
  .object({
    products: z.array(
      z.object({
        id: z.number(),
        product_id: z.number(),
        quantityOut: z.number(),
        quantitySold: z.number().min(0),
      })
    ),
  })
  .superRefine((data, ctx) => {
    data.products.forEach((item, index) => {
      if (item.quantitySold > item.quantityOut) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["products", index, "quantitySold"],
          message: `ไม่สามารถขายได้เกินจำนวนที่ฝาก (${item.quantityOut} รายการ)`,
        });
      }
    });
  });

export type ConsignmentValues = z.infer<typeof ConsignmentSchema>;
