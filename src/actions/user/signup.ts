"use server";
import { ActionError, ActionResponse } from "@/libs/action";
import { SignUpSchema, SignUpValues } from "@/schema/Signup";
import bcrypt from "bcrypt";
import db from "@/libs/db";
import { Role } from "@prisma/client";
import { permissionsToMask } from "@/libs/permission";
import { SuperPermissionEnum } from "@/enums/permission";

const Signup = async (
  payload: SignUpValues
): Promise<ActionResponse<SignUpValues>> => {
  try {
    const validated = SignUpSchema.parse(payload);
    const existingUser = await db.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      throw new Error("Email already exists");
    }

    const store = await db.store.create({
      data: {
        name: validated.name,
        roles: {
          create: {
            label: "Owner",
            permission: permissionsToMask([SuperPermissionEnum.ALL]).toString(),
          },
        },
      },
      include: {
        roles: true,
      },
    });

    const ownerRole = store.roles[0] as Role;
    const user = await db.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        password: await bcrypt.hash(validated.password, 15),
        userStores: {
          create: {
            store: {
              connect: { id: store.id },
            },
            role: {
              connect: { id: ownerRole.id }, 
            },
          },
        },
      },
    });

    return { success: true, data: validated };
  } catch (error) {
    return ActionError(error) as ActionResponse<SignUpValues>;
  }
};

export default Signup;
