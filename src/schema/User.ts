import { z } from "zod";

export const CreateUserSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().optional(),
});

export type CreateUserValues = z.infer<typeof CreateUserSchema>;
