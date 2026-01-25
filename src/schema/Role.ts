import { z } from "zod";

export const RoleSchema = z
  .object({
    label: z.string().min(3, "ชื่อตำแหน่งต้องมีอย่างน้อย 3 ตัวอักษร"),
    description: z.string().optional(),
    permissions: z
      .array(z.string())
      .min(1, "กรุณาเลือกสิทธิ์อย่างน้อย 1 รายการ"),
  })
  .required();

export type RoleValues = z.infer<typeof RoleSchema>;
