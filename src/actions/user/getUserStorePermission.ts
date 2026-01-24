"use server";

import db from "@/libs/db";

const getUserStorePermission = async (
  employeeId: number,
  storeIdentifier: string,
) => {
  try {
    const permissions = await db.employee.findFirstOrThrow({
      where: {
        id: employeeId,
        store: {
          OR: [{ slug: storeIdentifier }, { id: storeIdentifier }],
        },
      },
      select: {
        role: {
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
      permissions?.role?.permissions.map((permission) => {
        return {
          id: permission.id,
          name: permission.name,
        };
      }) || [];

    return permissionRemapping;
  } catch (error) {
    console.error("getUserStorePermission : ", error);
    return [];
  }
};

export default getUserStorePermission;
