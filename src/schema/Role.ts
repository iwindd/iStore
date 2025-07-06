import { z } from "zod";

export const RoleSchema = z.object({
  label: z.string().min(3),
  permissions: z.array(z.string()).min(1, "At least one permission is required"),
}).required();

export type RoleValues = z.infer<typeof RoleSchema>;