import { z } from "zod";
import { UserSchema } from "./User";

export const SignInSchema = z
  .object({
    email: UserSchema.shape.email,
    password: UserSchema.shape.password,
    rememberMe: z.boolean().optional(),
  })
  .required();

export type SignInValues = z.infer<typeof SignInSchema>;
