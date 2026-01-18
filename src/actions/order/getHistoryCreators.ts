"use server";

import db from "@/libs/db";
import { getUser } from "@/libs/session";

const getHistoryCreators = async () => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    // Get employees who have created orders for this store
    const employees = await db.employee.findMany({
      where: {
        store_id: user.store,
        orders: {
          some: {},
        },
      },
      select: {
        id: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    return employees.map((e) => ({
      id: e.id,
      name: e.user.name,
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default getHistoryCreators;
