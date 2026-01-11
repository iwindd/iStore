"use server";

import db from "@/libs/db";
import {
  LineApplicationSchema,
  LineApplicationSchemaType,
} from "@/schema/Application";
import { revalidatePath } from "next/cache";

export const createLineApplication = async (
  data: LineApplicationSchemaType
) => {
  const validation = LineApplicationSchema.safeParse(data);

  if (!validation.success) {
    throw new Error(validation.error.message);
  }

  try {
    await db.lineApplication.create({
      data: {
        name: data.name,
        channelAccessToken: data.channelAccessToken,
        channelSecret: data.channelSecret,
        useAsChatbot: data.useAsChatbot,
        useAsBroadcast: data.useAsBroadcast,
      },
    });

    revalidatePath("/applications");
    return { success: true, message: "สร้างแอพพลิเคชั่นสำเร็จ" };
  } catch (error: any) {
    console.error("Error creating line application:", error);
    // Handle Prisma unique constraint error for name
    if (error.code === "P2002" && error.meta?.target?.includes("name")) {
      return { success: false, message: "ชื่อแอพพลิเคชั่นนี้มีอยู่แล้ว" };
    }

    return {
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการสร้างแอพพลิเคชั่น",
    };
  }
};
