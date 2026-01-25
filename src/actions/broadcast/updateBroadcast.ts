"use server";
import { StorePermissionEnum } from "@/enums/permission";
import { ActionError } from "@/libs/action";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import {
  UpdateBroadcastSchema,
  UpdateBroadcastValues,
} from "@/schema/Broadcast";
import dayjs from "dayjs";

export const updateBroadcast = async (
  storeSlug: string,
  id: number,
  values: UpdateBroadcastValues,
) => {
  try {
    const ctx = await getPermissionContext(storeSlug);
    assertStoreCan(ctx, StorePermissionEnum.BROADCAST_MANAGEMENT);

    // Validate input
    const validated = UpdateBroadcastSchema.safeParse(values);
    if (!validated.success) {
      throw new Error(validated.error.errors[0].message);
    }

    // Verify broadcast exists and belongs to the store
    const existingBroadcast = await db.broadcast.findFirst({
      where: {
        id,
        store_id: ctx.storeId,
      },
    });

    if (!existingBroadcast) {
      throw new Error("ไม่พบ Broadcast ที่ต้องการแก้ไข");
    }

    // Only allow editing DRAFT or SCHEDULED broadcasts
    if (!["DRAFT", "SCHEDULED"].includes(existingBroadcast.status)) {
      throw new Error("ไม่สามารถแก้ไข Broadcast ที่ส่งไปแล้วหรือถูกยกเลิก");
    }

    // Verify event exists and belongs to the store
    const event = await db.event.findFirst({
      where: {
        id: values.event_id,
        store_id: ctx.storeId,
      },
    });

    if (!event) {
      throw new Error("ไม่พบโปรโมชั่นที่เลือก");
    }

    // Validate scheduled_at is within event dates
    const scheduledAt = dayjs(values.scheduled_at);
    if (!scheduledAt.isBetween(event.start_at, event.end_at)) {
      throw new Error("วันเวลา Broadcast ต้องอยู่ในช่วงของโปรโมชั่น");
    }

    // Update broadcast
    const broadcast = await db.broadcast.update({
      where: { id },
      data: {
        event_id: values.event_id,
        title: values.title,
        message: values.message,
        image_url: values.image_url || null,
        scheduled_at: scheduledAt.toDate(),
        status: "SCHEDULED",
      },
    });

    return broadcast;
  } catch (error) {
    console.error(error);
    throw ActionError(error);
  }
};
