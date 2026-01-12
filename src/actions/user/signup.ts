"use server";
import { SuperPermissionEnum } from "@/enums/permission";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { SignUpSchema, SignUpValues } from "@/schema/Signup";
import bcrypt from "bcrypt";

const Signup = async (
  payload: SignUpValues
): Promise<ActionResponse<SignUpValues>> => {
  try {
    const validated = SignUpSchema.parse(payload);
    const existingUser = await db.user.findFirst({
      where: { email: validated.email },
    });

    if (existingUser) {
      throw new Error("Email already exists");
    }

    await db.$transaction(async (tx) => {
      // CREATE USER
      const user = await tx.user.create({
        data: {
          name: validated.name,
          email: validated.email,
          password: await bcrypt.hash(validated.password, 15),
        },
      });

      // CREATE STORE
      const store = await tx.store.create({
        data: {
          name: validated.name,
        },
      });

      // CREATE OWNER STORE ROLE
      const ownerRole = await tx.role.create({
        data: {
          label: "เจ้าของร้าน",
          store: {
            connect: { id: store.id },
          },
          permissions: {
            connect: {
              name: SuperPermissionEnum.ALL,
            },
          },
        },
      });

      // CONNECT USER TO STORE AS EMPLOYEE
      await tx.employee.create({
        data: {
          user: {
            connect: { id: user.id },
          },
          store: {
            connect: { id: store.id },
          },
          role: {
            connect: { id: ownerRole.id },
          },
        },
      });
    });

    return { success: true, data: validated };
  } catch (error) {
    console.error(error);
    return ActionError(error) as ActionResponse<SignUpValues>;
  }
};

export default Signup;
