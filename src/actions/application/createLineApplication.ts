"use server";

import db from "@/libs/db";
import { getUser } from "@/libs/session";
import {
  LineApplicationSchema,
  LineApplicationSchemaType,
} from "@/schema/Application";
import { revalidatePath } from "next/cache";
import crypto from "node:crypto";

export const createLineApplication = async (
  data: LineApplicationSchemaType
) => {
  const user = await getUser();
  if (!user) throw new Error("User not found");
  const validation = LineApplicationSchema.safeParse(data);

  if (!validation.success) {
    throw new Error(validation.error.message);
  }

  try {
    const apiKey = `iSL-${crypto.randomBytes(16).toString("hex")}`;
    await db.lineApplication.create({
      data: {
        name: data.name,
        channelAccessToken: data.channelAccessToken,
        channelSecret: data.channelSecret,
        key: apiKey,
        useAsChatbot: data.useAsChatbot,
        useAsBroadcast: data.useAsBroadcast,
        store_id: user.store,
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
