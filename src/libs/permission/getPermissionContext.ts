import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { cache } from "react";
import { PermissionContext } from "./context";

export const getPermissionContext = cache(
  async (storeSlug?: string): Promise<PermissionContext> => {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    const result: PermissionContext = {
      userId: user.id,
      storeSlug,
      globalPermissions: new Set(),
      storePermissions: new Set(),
    };

    const globalPermissions = await db.user.findUnique({
      where: {
        id: user.id,
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
            id: user.id,
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
