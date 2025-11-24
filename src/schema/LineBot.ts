import { z } from "zod";

export const LineBotSchema = z.object({
  lineUserId: z.string().min(1, "Line User ID is required"),
  lineChannelAccessToken: z.string().min(1, "Channel Access Token is required"),
  lineChannelSecret: z.string().min(1, "Channel Secret is required"),
});

export type LineBotValues = z.infer<typeof LineBotSchema>;
