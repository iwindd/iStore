import { z } from "zod";
import { UserSchema } from "./User";

export const PasswordSchema = z
  .object({
    old_password: UserSchema.shape.password,
    password: UserSchema.shape.password,
    password_confirmation: UserSchema.shape.password,
  })
  .refine((data) => data.password == data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
  });

export type PasswordValues = z.infer<typeof PasswordSchema>;

export const SetPasswordSchema = z
  .object({
    password: UserSchema.shape.password,
    password_confirmation: UserSchema.shape.password,
  })
  .refine((data) => data.password == data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
  });

export type SetPasswordValues = z.infer<typeof SetPasswordSchema>;
