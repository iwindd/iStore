import { z } from "zod";

export const PasswordSchema = z
  .object({
    old_password: z.string().min(6),
    password: z.string().min(6),
    password_confirmation: z.string().min(6),
  })
  .refine((data) => data.password == data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
  });

export type PasswordValues = z.infer<typeof PasswordSchema>;

export const SetPasswordSchema = z
  .object({
    password: z.string().min(6),
    password_confirmation: z.string().min(6),
  })
  .refine((data) => data.password == data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
  });

export type SetPasswordValues = z.infer<typeof SetPasswordSchema>;
