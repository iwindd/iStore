import z from "zod";

// Schema สำหรับการสร้าง Store ใหม่
export const CreateStoreSchema = z.object({
  // Project Info TODO:: Remove ProjectName
  projectName: z
    .string()
    .min(3, "Project name must be at least 3 characters")
    .max(100, "Project name must be at most 100 characters")
    .regex(/^[a-zA-Z0-9\s\-_]+$/, "Project name must be English only"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(50, "Slug must be at most 50 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase, no spaces, use hyphens",
    ),

  // Store Info
  storeName: z
    .string()
    .min(1, "Store name is required")
    .max(255, "Store name must be at most 255 characters"),

  // Address (Optional)
  address: z
    .object({
      subDistrictId: z.number(),
      addressLine: z.string().max(500).optional(),
      zipcodeSnapshot: z.string().optional(),
    })
    .optional(),
});

export type CreateStoreValues = z.infer<typeof CreateStoreSchema>;
