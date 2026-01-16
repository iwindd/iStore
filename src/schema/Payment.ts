import { Method } from "@prisma/client";
import { z } from "zod";

export const CashoutInputSchema = z.object({
  method: z.enum([Method.CASH, Method.BANK]),
  note: z.string().optional(),
});

export type CashoutInputValues = z.infer<typeof CashoutInputSchema>;

const ProductShape = z.object({
  id: z.number(),
  quantity: z.number().min(1, "จำนวนต้องมากกว่าหรือเท่ากับ 1"),
  note: z.string().max(40).optional(),
});

export const CashoutSchema = z
  .object({
    products: z.array(ProductShape),
    preOrderProducts: z.array(ProductShape),
  })
  .merge(CashoutInputSchema)
  .superRefine((data, ctx) => {
    const total = data.products.length + data.preOrderProducts.length;

    if (total === 0) {
      ctx.addIssue({
        path: ["products"],
        code: z.ZodIssueCode.custom,
        message: "ต้องมีสินค้าอย่างน้อย 1 รายการ",
      });
    }
  });

export type CashoutValues = z.infer<typeof CashoutSchema>;

export const ConsignmentInputSchema = z.object({
  note: z.string().optional(),
});

export type ConsignmentInputValues = z.infer<typeof ConsignmentInputSchema>;

export const ConsignmentSchema = z
  .object({
    products: z.array(ProductShape).min(1, "ต้องมีสินค้าอย่างน้อย 1 รายการ"),
  })
  .merge(ConsignmentInputSchema);

export type ConsignmentValues = z.infer<typeof ConsignmentSchema>;
