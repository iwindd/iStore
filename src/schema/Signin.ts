import { z } from "zod";

export const SignInSchema = z
  .object({
    email: z.string().email().min(6),
    password: z.string().min(6),
    rememberMe: z.boolean().optional(),
  })
  .required();

export type SignInValues = z.infer<typeof SignInSchema>;
