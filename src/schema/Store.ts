import z from "zod";

export const StoreSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters long").max(255),
  })
  .required();

export type StoreValues = z.infer<typeof StoreSchema>;
