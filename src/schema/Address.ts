import { z } from "zod";

export const AddressSchema = z.object({
  address: z.string(),
  district: z.string(),
  area: z.string(),
  province: z.string(),
  postalcode: z.string(),
});

export type AddressValues = z.infer<typeof AddressSchema>;
