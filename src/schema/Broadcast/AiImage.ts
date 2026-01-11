import { z } from "zod";

export const AiImagePromptSchema = z.object({
  prompt: z
    .string()
    .min(5, "Prompt must be at least 5 characters long")
    .max(500, "Prompt is too long"),
});

export type AiImagePromptValues = z.infer<typeof AiImagePromptSchema>;
