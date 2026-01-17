"use server";

import db from "@/libs/db";
import { getUser } from "@/libs/session";

const getStoreSwitcher = async () => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    const stores = await db.store.findMany({
      where: {
        employees: {
          some: {
            user_id: user.id,
          },
        },
      },
      select: {
        name: true,
        id: true,
      },
    });

    return stores;
  } catch (error) {
    console.log("getStoreSwitcher : ", error);
    return [];
  }
};

export default getStoreSwitcher;
