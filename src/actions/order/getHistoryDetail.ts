"use server";
import { CashoutType } from "@/enums/cashout";
import { HistoryPermissionEnum } from "@/enums/permission";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { Prisma } from "@prisma/client";

const getHistoryDetail = async (id: number) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    const where: Prisma.OrderWhereInput = {
      id: id,
      store_id: user.store,
      type: CashoutType.CASHOUT,
      creator_id: user.limitPermission(HistoryPermissionEnum.READ),
    };

    const history = await db.order.findFirstOrThrow({
      where,
      select: {
        id: true,
        total: true,
        cost: true,
        profit: true,
        note: true,
        creator_id: true,
        created_at: true,
        creator: {
          select: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return history;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default getHistoryDetail;
