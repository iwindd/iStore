import BotApp from "@/libs/botapp";
import { validateCronRequest } from "@/libs/cron";
import db from "@/libs/db";
import { BroadcastStatus } from "@prisma/client";
import dayjs from "dayjs";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

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
    });

    const results = [];

    for (const broadcast of broadcasts) {
      try {
        await BotApp.post(`/broadcast/sendAll`, {
          text: broadcast.message,
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
      { status: 500 }
    );
  }
}
