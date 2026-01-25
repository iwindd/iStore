"use server";
import { PermissionConfig } from "@/config/permissionConfig";
import { ActionError } from "@/libs/action";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { BroadcastStatus } from "@prisma/client";

export const cancelBroadcast = async (storeSlug: string, id: number) => {
  try {
    const ctx = await getPermissionContext(storeSlug);
    assertStoreCan(ctx, PermissionConfig.store.broadcast.cancel);

    // Verify broadcast exists and belongs to the store
    const existingBroadcast = await db.broadcast.findFirst({
      where: {
        id,
        store_id: ctx.storeId!,
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
