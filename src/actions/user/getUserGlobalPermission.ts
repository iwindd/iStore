"use server";

import { auth } from "@/auth";
import db from "@/libs/db";
import { unauthorized } from "next/navigation";

const getUserGlobalPermission = async () => {
  try {
    const user = await auth();
    if (!user?.user) unauthorized();

    const permissions = await db.user.findFirstOrThrow({
      where: {
        id: Number(user.user.id),
      },
      select: {
        global_role: {
          select: {
            permissions: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    const permissionRemapping =
      permissions?.global_role?.permissions.map((permission) => {
        return {
          id: permission.id,
          name: permission.name,
        };
      }) || [];

    return permissionRemapping;
  } catch (error) {
    console.error("getUserGlobalPermission : ", error);
    return [];
  }
};

export default getUserGlobalPermission;
