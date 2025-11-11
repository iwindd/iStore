import z from "zod";

export const AddProductDialogSchema = z.object({
  product_id: z.number(),
  quantity: z.number().int().min(1),
});

export type AddProductDialogValues = z.infer<typeof AddProductDialogSchema>;
