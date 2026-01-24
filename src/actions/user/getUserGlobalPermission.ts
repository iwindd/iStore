"use server";

import db from "@/libs/db";
import { getUser } from "@/libs/session";

const getUserGlobalPermission = async () => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    const permissions = await db.user.findFirstOrThrow({
      where: {
        id: user.id,
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
