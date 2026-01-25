import { auth } from "@/auth";
import db from "@/libs/db";
import { unauthorized } from "next/navigation";
import { cache } from "react";
import { PermissionContext } from "./context";

export const getPermissionContext = cache(
  async (storeSlug?: string): Promise<PermissionContext> => {
    const session = await auth();
    if (!session?.user) unauthorized();

    const result: PermissionContext = {
      userId: Number(session.user.id),
      storeSlug,
      globalPermissions: new Set(),
      storePermissions: new Set(),
    };

    const globalPermissions = await db.user.findUnique({
      where: {
        id: result.userId,
      },
      select: {
        global_role: {
          select: {
            permissions: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    result.globalPermissions = new Set(
      globalPermissions?.global_role?.permissions.map(
        (permission) => permission.name,
      ) || [],
    );

    if (storeSlug) {
      const employeeStoreData = await db.employee.findFirst({
        where: {
          user: {
            id: result.userId,
          },
          store: {
            slug: storeSlug,
          },
        },
        select: {
          id: true,
          store_id: true,
          role: {
            select: {
              permissions: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      result.storeId = employeeStoreData?.store_id;
      result.employeeId = employeeStoreData?.id;
      result.storePermissions = new Set(
        employeeStoreData?.role?.permissions.map(
          (permission) => permission.name,
        ) || [],
      );
    }

    return result;
  },
);
