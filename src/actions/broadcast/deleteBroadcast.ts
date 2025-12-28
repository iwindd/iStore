"use server";
import { ActionError } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";

export const deleteBroadcast = async (id: number) => {
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
      throw new Error("ไม่พบ Broadcast ที่ต้องการลบ");
    }

    // Only allow deleting DRAFT or CANCELLED broadcasts
    if (!["DRAFT", "CANCELLED"].includes(existingBroadcast.status)) {
      throw new Error("ไม่สามารถลบ Broadcast ที่อยู่ในคิวหรือส่งไปแล้ว");
    }

    // Delete broadcast
    await db.broadcast.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    throw ActionError(error);
  }
};
