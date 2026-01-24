import { isValid } from "@/libs/ean";
import { z } from "zod";

export const ProductSchema = z
  .object({
    serial: z.string().min(10).max(15),
    label: z.string().min(3).max(60),
  })
  .required();

export type ProductValues = z.infer<typeof ProductSchema>;

export const ProductFindSchema = z
  .object({
    serial: z.string(),
  })
  .refine((data) => isValid(data.serial), {
    message: "Invalid EAN",
    path: ["serial"],
  });

export type ProductFindValues = z.infer<typeof ProductFindSchema>;

export const ProductUpdateSchema = z.object({
  label: z.string().min(3).max(60),
  price: z.number().min(0),
  cost: z.number().min(0),
  category_id: z
    .number()
    .nullable()
    .transform((val) => (val == null || val <= 0 ? null : val)),
});

export type ProductUpdateValues = z.infer<typeof ProductUpdateSchema>;

export const ProductAdjustStockSchema = z.object({
  stock: z.number().min(0),
  note: z.string().max(255),
});

export type ProductAdjustStockValues = z.infer<typeof ProductAdjustStockSchema>;

export const ProductStockAlertSchema = z.object({
  alertCount: z.number().min(0),
  useAlert: z.boolean(),
});

export type ProductStockAlertValues = z.infer<typeof ProductStockAlertSchema>;

export const ProductPreorderSchema = z.object({
  usePreorder: z.boolean(),
});

export type ProductPreorderValues = z.infer<typeof ProductPreorderSchema>;
