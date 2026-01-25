"use server";

import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import {
  LineApplicationSchema,
  LineApplicationSchemaType,
} from "@/schema/Application";
import { revalidatePath } from "next/cache";

export const updateLineApplication = async (
  storeSlug: string,
  id: number,
  data: LineApplicationSchemaType,
) => {
  const ctx = await getPermissionContext(storeSlug);
  assertStoreCan(ctx, PermissionConfig.store.application.updateLineApplication);
  const validation = LineApplicationSchema.safeParse(data);

  if (!validation.success) {
    throw new Error(validation.error.message);
  }

  try {
    await db.lineApplication.update({
      where: { id },
      data: {
        name: data.name,
        channelAccessToken: data.channelAccessToken,
        channelSecret: data.channelSecret,
        useAsChatbot: data.useAsChatbot,
        useAsBroadcast: data.useAsBroadcast,
      },
    });

    revalidatePath(`/projects/${storeSlug}/applications`);
    revalidatePath(`/projects/${storeSlug}/applications/line/${id}`);
    return { success: true, message: "อัพเดทแอพพลิเคชั่นสำเร็จ" };
  } catch (error: any) {
    console.error("Error updating line application:", error);
    // Handle Prisma unique constraint error for name
    if (error.code === "P2002" && error.meta?.target?.includes("name")) {
      return { success: false, message: "ชื่อแอพพลิเคชั่นนี้มีอยู่แล้ว" };
    }

    return {
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการอัพเดทแอพพลิเคชั่น",
    };
  }
};
