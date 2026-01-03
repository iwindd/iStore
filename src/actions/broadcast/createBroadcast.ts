"use server";
import { ActionError } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import {
  CreateBroadcastSchema,
  CreateBroadcastValues,
} from "@/schema/Broadcast";
import dayjs from "dayjs";

export const createBroadcast = async (values: CreateBroadcastValues) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    // Validate input
    const validated = CreateBroadcastSchema.safeParse(values);
    if (!validated.success) {
      throw new Error(validated.error.errors[0].message);
    }

    // Verify event exists and belongs to the store
    const event = await db.event.findFirst({
      where: {
        id: values.event_id,
        store_id: user.store,
      },
    });

    if (!event) {
      throw new Error("ไม่พบโปรโมชั่นที่เลือก");
    }

    // Determine status and scheduled_at based on type
    let scheduledAt: dayjs.Dayjs;
    let status: "DRAFT" | "SCHEDULED" = "SCHEDULED";

    if (values.type === "DRAFT") {
      status = "DRAFT";
      scheduledAt = values.scheduled_at
        ? dayjs(values.scheduled_at)
        : dayjs(event.start_at);
    } else if (values.type === "INSTANT") {
      scheduledAt = dayjs();
    } else {
      if (!values.scheduled_at) {
        throw new Error("กรุณาระบุเวลาที่ต้องการประกาศ");
      }
      scheduledAt = dayjs(values.scheduled_at);
    }

    // Validate scheduled_at is within event dates (Skip for DRAFT)
    if (
      status !== "DRAFT" &&
      !scheduledAt.isBetween(event.start_at, event.end_at, null, "[]")
    ) {
      // Allow slight margin for INSTANT or strict?
      // If INSTANT (now), and now is not within [start, end], we error.
      // This implies we can only broadcast active events.
      throw new Error("วันเวลา Broadcast ต้องอยู่ในช่วงของโปรโมชั่น");
    }

    // Create broadcast
    const broadcast = await db.broadcast.create({
      data: {
        event_id: values.event_id,
        store_id: user.store,
        title: values.title,
        message: values.message,
        image_url: values.image_url || null,
        scheduled_at: scheduledAt.toDate(),
        status: status,
        creator_id: user.userStoreId,
      },
    });

    return broadcast;
  } catch (error) {
    console.error(error);
    throw ActionError(error);
  }
};
