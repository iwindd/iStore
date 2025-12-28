import z from "zod";

export const CreateBroadcastSchema = z
  .object({
    event_id: z.number().int().positive("กรุณาเลือกโปรโมชั่น"),
    title: z.string().min(1, "กรุณากรอกหัวข้อประกาศ"),
    message: z.string().min(1, "กรุณากรอกข้อความประกาศ"),
    image_url: z.string().url().optional().or(z.literal("")),
    scheduled_at: z.date({ required_error: "กรุณาเลือกวันเวลาที่จะประกาศ" }),
  })
  .refine((data) => data.scheduled_at > new Date(), {
    message: "วันเวลาต้องมากกว่าเวลาปัจจุบัน",
    path: ["scheduled_at"],
  });

export type CreateBroadcastValues = z.infer<typeof CreateBroadcastSchema>;

export const UpdateBroadcastSchema = CreateBroadcastSchema;
export type UpdateBroadcastValues = z.infer<typeof UpdateBroadcastSchema>;
