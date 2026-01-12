"use server";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { BroadcastStatus } from "@prisma/client";
import sendBroadcastToApplications from "../application/sendBroadcastToApplications";

export const sendBroadcast = async (id: number) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    const broadcast = await db.broadcast.update({
      where: {
        store_id: user.store,
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

    sendBroadcastToApplications(user.store, {
      message: broadcast.message,
      image_url: (broadcast?.image_url && broadcast.image_url) || undefined,
    });

    return broadcast;
  } catch (error) {
    console.error("Error sending broadcast:", error);
    throw error;
  }
};
