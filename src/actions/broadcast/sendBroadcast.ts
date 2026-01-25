"use server";
import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { BroadcastStatus } from "@prisma/client";
import sendBroadcastToApplications from "../application/sendBroadcastToApplications";

export const sendBroadcast = async (storeSlug: string, id: number) => {
  try {
    const ctx = await getPermissionContext(storeSlug);
    assertStoreCan(ctx, PermissionConfig.store.broadcast.send);

    const broadcast = await db.broadcast.update({
      where: {
        store_id: ctx.storeId,
        status: {
          in: [BroadcastStatus.DRAFT, BroadcastStatus.SCHEDULED],
        },
        id,
      },
      data: {
        status: BroadcastStatus.SENT,
        sent_at: new Date(),
      },
      select: {
        message: true,
        image_url: true,
      },
    });

    sendBroadcastToApplications(ctx.storeId!, {
      message: broadcast.message,
      image_url: (broadcast?.image_url && broadcast.image_url) || undefined,
    });

    return broadcast;
  } catch (error) {
    console.error("Error sending broadcast:", error);
    throw error;
  }
};
