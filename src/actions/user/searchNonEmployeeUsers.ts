"use server";

import db from "@/libs/db";

export const searchNonEmployeeUsers = async (
  storeId: string,
  query: string,
) => {
  const users = await db.user.findMany({
    where: {
      AND: [
        {
          OR: [
            { first_name: { contains: query, mode: "insensitive" } },
            { last_name: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
          ],
        },
        {
          employees: {
            none: {
              store_id: storeId,
            },
          },
        },
      ],
    },
    take: 20,
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
    },
  });

  return users;
};
