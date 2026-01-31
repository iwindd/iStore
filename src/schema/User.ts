import { z } from "zod";

export const UserSchema = z.object({
  first_name: z.string().min(6).max(100),
  last_name: z.string().min(6).max(255),
  email: z.string().email("Invalid email address").max(255),
  password: z.string().min(6).max(100),
});

export const CreateUserSchema = z.object({
  first_name: UserSchema.shape.first_name,
  last_name: UserSchema.shape.last_name,
  email: UserSchema.shape.email,
  password: UserSchema.shape.password.optional(),
});

export type CreateUserValues = z.infer<typeof CreateUserSchema>;
