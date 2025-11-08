"use server";
import { BorrowPermissionEnum } from "@/enums/permission";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { Borrow } from "@prisma/client";
import { getFilterRange } from "./range";

const getBorrows = async (store: string): Promise<Borrow[]> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    return await db.borrow.findMany({
      where: {
        store_id: store,
        creator_id: user.onPermission(BorrowPermissionEnum.READ),
        ...(await getFilterRange()),
      },
    });
  } catch (error) {
    return [];
  }
};

export default getBorrows;
