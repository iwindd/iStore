import { Method } from "@prisma/client";
import { z } from "zod";

export const CashoutInputSchema = z.object({
  method: z.enum([Method.CASH, Method.BANK]),
  note: z.string().optional(),
});

export type CashoutInputValues = z.infer<typeof CashoutInputSchema>;

export const CashoutSchema = z
  .object({
    products: z
      .array(
        z.object({
          id: z.number(),
          quantity: z.number().min(1, "จำนวนต้องมากกว่าหรือเท่ากับ 1"),
          note: z.string().max(40).optional(),
        })
      )
      .min(1, "ต้องมีสินค้าอย่างน้อย 1 รายการ"),
  })
  .merge(CashoutInputSchema);

export type CashoutValues = z.infer<typeof CashoutSchema>;
