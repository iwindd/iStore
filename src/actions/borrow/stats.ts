"use server";
import { BorrowPermissionEnum } from "@/enums/permission";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { Borrow } from "@prisma/client";

interface BorrowStat{
  status: Borrow['status']
}

const GetBorrowStats = async (): Promise<ActionResponse<BorrowStat[]>> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    if (!user.hasPermission(BorrowPermissionEnum.READ)) throw new Error("Forbidden");
    const borrows = await db.borrow.findMany({
      where: {
        store_id: user.store,
      },
      select: {
        status: true
      }
    });

    return {
      success: true,
      data: borrows,
    };
  } catch (error) {
    return ActionError(error) as ActionResponse<BorrowStat[]>;
  }
};

export default GetBorrowStats;
