import z from "zod";

export const BroadcastType = z.enum(["DRAFT", "SCHEDULED", "INSTANT"]);
export type BroadcastType = z.infer<typeof BroadcastType>;

export const CreateBroadcastSchema = z
  .object({
    type: BroadcastType.default("SCHEDULED"),
    event_id: z.number().int().positive("กรุณาเลือกโปรโมชั่น"),
    title: z.string().min(1, "กรุณากรอกหัวข้อประกาศ"),
    message: z.string().min(1, "กรุณากรอกข้อความประกาศ"),
    image_url: z.string().url().optional().or(z.literal("")),
    scheduled_at: z.date().optional(),
  })
  .refine(
    (data) => {
      // If SCHEDULED, scheduled_at is required and must be future
      if (data.type === "SCHEDULED") {
        if (!data.scheduled_at) return false;
        return data.scheduled_at > new Date();
      }
      return true;
    },
    {
      message: "กรุณาระบุเวลาที่ต้องการประกาศ (ต้องมากกว่าเวลาปัจจุบัน)",
      path: ["scheduled_at"],
    }
  );

export type CreateBroadcastValues = z.infer<typeof CreateBroadcastSchema>;

export const UpdateBroadcastSchema = CreateBroadcastSchema;
export type UpdateBroadcastValues = z.infer<typeof UpdateBroadcastSchema>;
