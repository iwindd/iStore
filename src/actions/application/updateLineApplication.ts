"use server";

import db from "@/libs/db";
import {
  LineApplicationSchema,
  LineApplicationSchemaType,
} from "@/schema/Application";
import { revalidatePath } from "next/cache";

export const updateLineApplication = async (
  id: number,
  data: LineApplicationSchemaType
) => {
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

    revalidatePath("/applications");
    revalidatePath(`/applications/line/${id}`);
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
