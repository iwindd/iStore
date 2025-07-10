import { z } from "zod";

export const BorrowsSchema = z
  .object({
    product: z.number().transform((val) => val == null || val <= 0 ? null : val),
    note: z.string(),
    count: z.number().min(1),
  })

export type BorrowsValues = z.infer<typeof BorrowsSchema>;
