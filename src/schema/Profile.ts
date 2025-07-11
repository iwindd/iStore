import { z } from "zod";

export const ProfileSchema = z
  .object({
    name: z.string().min(6).max(60),
  })

export type ProfileValues = z.infer<typeof ProfileSchema>;
