"use server";
import { Borrows } from "@prisma/client";
import db from "@/libs/db";
import { getFilterRange } from "./range";
import { getUser } from "@/libs/session";
import { BorrowPermissionEnum } from "@/enums/permission";

const getBorrows = async (store: number): Promise<Borrows[]> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    return await db.borrows.findMany({
      where: {
        store_id: store,
        user_store_id: user.hasPermission(BorrowPermissionEnum.READ) ? user.userStoreId : undefined,
        ...await getFilterRange()
      },
    });
  } catch (error) {
    return [];
  }
};

export default getBorrows;
