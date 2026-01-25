"use server";
import { PermissionConfig } from "@/config/permissionConfig";
import { ActionError } from "@/libs/action";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";

export const deleteBroadcast = async (storeSlug: string, id: number) => {
  try {
    const ctx = await getPermissionContext(storeSlug);
    assertStoreCan(ctx, PermissionConfig.store.broadcast.delete);

    // Verify broadcast exists and belongs to the store
    const existingBroadcast = await db.broadcast.findFirst({
      where: {
        id,
        store_id: ctx.storeId!,
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
