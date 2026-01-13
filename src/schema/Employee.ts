import { z } from "zod";

export const EmployeeSchema = z.object({
  name: z.string().min(6).max(60),
  email: z.string().email().min(6),
  role: z
    .number()
    .refine((val) => val > 0, "กรุณาเลือกตำแหน่ง")
    .transform((val) => (val == null || val <= 0 ? null : val)),
});

export type EmployeeValues = z.infer<typeof EmployeeSchema>;
