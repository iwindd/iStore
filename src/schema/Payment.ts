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
        z
          .object({
            id: z.number(),
            quantity: z.number().min(1, "จำนวนต้องมากกว่าหรือเท่ากับ 1"),
            note: z.string().max(40).optional(),
            preOrder: z
              .object({
                preOrderAll: z.boolean(),
                quantity: z.number().min(1).optional(),
              })
              .optional(),
          })
          .transform((product) => {
            if (!product.preOrder) {
              return {
                ...product,
                preOrder: undefined,
              };
            }

            const preOrderValue = product.preOrder.preOrderAll
              ? product.quantity
              : (product.preOrder.quantity ?? 0);

            return {
              ...product,
              preOrder: preOrderValue > 0 ? preOrderValue : undefined,
            };
          })
      )
      .min(1, "ต้องมีสินค้าอย่างน้อย 1 รายการ"),
  })
  .merge(CashoutInputSchema);

export const CashoutServerSchema = z
  .object({
    products: z
      .array(
        z.object({
          id: z.number(),
          quantity: z.number().min(1, "จำนวนต้องมากกว่าหรือเท่ากับ 1"),
          note: z.string().max(40).optional(),
          preOrder: z.number().min(1).optional(),
        })
      )
      .min(1, "ต้องมีสินค้าอย่างน้อย 1 รายการ"),
  })
  .merge(CashoutInputSchema);

export type CashoutValues = z.infer<typeof CashoutSchema>;
export type CashoutServerValues = z.infer<typeof CashoutServerSchema>;
