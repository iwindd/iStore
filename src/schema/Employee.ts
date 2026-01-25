import { z } from "zod";

export const EmployeeSchema = z.object({
  firstName: z
    .string()
    .min(2, "ชื่อจริงต้องมีอย่างน้อย 2 ตัวอักษร")
    .max(50, "ชื่อจริงต้องไม่เกิน 50 ตัวอักษร"),
  lastName: z
    .string()
    .min(2, "นามสกุลต้องมีอย่างน้อย 2 ตัวอักษร")
    .max(50, "นามสกุลต้องไม่เกิน 50 ตัวอักษร"),
  email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
  password: z
    .string()
    .min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร")
    .optional()
    .or(z.literal("")),
  roleId: z.number().min(1, "กรุณาเลือกตำแหน่ง"),
});

export type EmployeeValues = z.infer<typeof EmployeeSchema>;
