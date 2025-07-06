"use server";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { EmployeeSchema, EmployeeValues } from "@/schema/Employee";
import bcrypt from "bcrypt";

export const create = async (
  payload: EmployeeValues
): Promise<ActionResponse<EmployeeValues>> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    const validated = EmployeeSchema.parse(payload);
    if (!validated.role) throw new Error("Role is required");

    await db.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        password: await bcrypt.hash("password", 15),
        userStores: {
          create: {
            store: {
              connect: { id: user.store }, 
            },
            role: {
              connect: { id: validated.role },
            },
          },
        },
      },
    });

    return { success: true, data: validated };
  } catch (error) {
    return ActionError(error) as ActionResponse<EmployeeValues>;
  }
};

