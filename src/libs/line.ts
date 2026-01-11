import env from "@/config/Env";
import * as line from "@line/bot-sdk";
import db from "./db";
export const runtime = "nodejs";

export const LineMessingApi = new line.messagingApi.MessagingApiClient({
  channelAccessToken: env.line.channelAccessToken,
});

export const getMessagingApiByKey = async (key: string) => {
  const application = await db.lineApplication.findUniqueOrThrow({
    where: {
      key: key,
    },
  });

  return {
    messagingApi: new line.messagingApi.MessagingApiClient({
      channelAccessToken: application.channelAccessToken,
    }),
    application,
  };
};
