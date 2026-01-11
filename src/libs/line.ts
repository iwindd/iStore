import env from "@/config/Env";
import * as line from "@line/bot-sdk";

export const LineMessingApi = new line.messagingApi.MessagingApiClient({
  channelAccessToken: env.line.channelAccessToken,
});
