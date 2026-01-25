"use server";

import db from "@/libs/db";
import { getServerSession } from "@/libs/session";
import { unauthorized } from "next/navigation";

const getStoreSwitcher = async () => {
  try {
    const user = await getServerSession();
    if (!user?.user) unauthorized();

    const stores = await db.store.findMany({
      where: {
        employees: {
          some: {
            user_id: Number(user.user.id),
          },
        },
      },
      select: {
        name: true,
        id: true,
        slug: true,
      },
    });

    return stores;
  } catch (error) {
    console.log("getStoreSwitcher : ", error);
    return [];
  }
};

export default getStoreSwitcher;
