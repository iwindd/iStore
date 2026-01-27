import { z } from "zod";

export const EmployeeSchema = z.object({
  userId: z.number().min(1, "กรุณาเลือกผู้ใช้"),
  roleId: z.number().min(1, "กรุณาเลือกตำแหน่ง"),
});

export type EmployeeValues = z.infer<typeof EmployeeSchema>;

export const EmployeeUpdateRoleSchema = z.object({
  roleId: z.number().min(1, "กรุณาเลือกตำแหน่ง"),
});

export type EmployeeUpdateRoleValues = z.infer<typeof EmployeeUpdateRoleSchema>;
