"use server";

import { ConflictError } from "@/errors/ConflictError";
import db from "@/libs/db";
import { CreateUserSchema, CreateUserValues } from "@/schema/User";
import bcrypt from "bcrypt";

const createUser = async (payload: CreateUserValues) => {
  const validated = CreateUserSchema.parse(payload);

  // Default password to "password" if not provided
  const passwordToHash = validated.password || "password";
  const hashedPassword = await bcrypt.hash(passwordToHash, 15);

  // Check if email already exists
  const existingUser = await db.user.findUnique({
    where: { email: validated.email },
  });

  if (existingUser) {
    throw new ConflictError("EMAIL_ALREADY_EXISTS");
  }

  await db.user.create({
    data: {
      first_name: validated.first_name,
      last_name: validated.last_name,
      email: validated.email,
      password: hashedPassword,
    },
  });

  return { success: true, data: null };
};

export default createUser;
