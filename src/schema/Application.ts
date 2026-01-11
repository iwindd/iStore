import { z } from "zod";

export const LineApplicationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  channelAccessToken: z.string().min(1, "Channel Access Token is required"),
  channelSecret: z.string().min(1, "Channel Secret is required"),
  useAsChatbot: z.boolean().default(false),
  useAsBroadcast: z.boolean().default(false),
});

export type LineApplicationSchemaType = z.infer<typeof LineApplicationSchema>;
