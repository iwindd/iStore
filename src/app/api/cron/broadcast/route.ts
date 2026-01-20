import sendBroadcastToApplications from "@/actions/application/sendBroadcastToApplications";
import { validateCronRequest } from "@/libs/cron";
import db from "@/libs/db";
import { BroadcastStatus } from "@prisma/client";
import dayjs from "dayjs";
import { NextResponse } from "next/server";

export const revalidate = 0;

export async function GET(req: Request) {
  try {
    if (!validateCronRequest(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = dayjs();

    const broadcasts = await db.broadcast.findMany({
      where: {
        status: BroadcastStatus.SCHEDULED,
        scheduled_at: {
          lte: now.toDate(),
        },
      },
      select: {
        id: true,
        message: true,
        image_url: true,
        store_id: true,
      },
    });

    const results = [];

    for (const broadcast of broadcasts) {
      try {
        sendBroadcastToApplications(broadcast.store_id, {
          message: broadcast.message,
          image_url: broadcast?.image_url ? broadcast.image_url : undefined,
        });

        await db.broadcast.update({
          where: { id: broadcast.id },
          data: {
            status: BroadcastStatus.SENT,
            sent_at: now.toDate(),
          },
        });

        results.push({ id: broadcast.id, status: "SUCCESS" });
      } catch (error) {
        console.error(`Failed to send broadcast ${broadcast.id}:`, error);

        await db.broadcast.update({
          where: { id: broadcast.id },
          data: {
            status: BroadcastStatus.FAILED,
          },
        });

        results.push({
          id: broadcast.id,
          status: "FAILED",
          error: String(error),
        });
      }
    }

    console.log("Broadcasts processed:", results);
    return NextResponse.json({
      success: true,
      processed: results.length,
      results,
    });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
