"use server";
import { ActionError } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { BroadcastStatus } from "@prisma/client";

export const cancelBroadcast = async (id: number) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    // Verify broadcast exists and belongs to the store
    const existingBroadcast = await db.broadcast.findFirst({
      where: {
        id,
        store_id: user.store,
      },
    });

    if (!existingBroadcast) {
      throw new Error("ไม่พบ Broadcast ที่ต้องการยกเลิก");
    }

    // Only allow cancelling DRAFT or SCHEDULED broadcasts
    if (!["DRAFT", "SCHEDULED"].includes(existingBroadcast.status)) {
      throw new Error("ไม่สามารถยกเลิก Broadcast ที่ส่งไปแล้ว");
    }

    // Update status to CANCELLED
    const broadcast = await db.broadcast.update({
      where: { id },
      data: {
        status: BroadcastStatus.CANCELLED,
      },
    });

    return broadcast;
  } catch (error) {
    console.error(error);
    throw ActionError(error);
  }
};
