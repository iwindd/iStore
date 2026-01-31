import { z } from "zod";
import { UserSchema } from "./User";

export const ProfileSchema = z.object({
  first_name: UserSchema.shape.first_name,
  last_name: UserSchema.shape.last_name,
});

export type ProfileValues = z.infer<typeof ProfileSchema>;
