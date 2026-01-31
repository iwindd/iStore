import { z } from "zod";

export const CategorySchema = z
  .object({
    label: z.string().min(3).max(100),
    active: z.boolean(),
  })
  .required();

export type CategoryValues = z.infer<typeof CategorySchema>;
