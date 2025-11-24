"use server";
import db from "@/libs/db";
import { LineBot } from "@/libs/lineBot";

export const sendEventNotification = async (eventId: number) => {
  const event = await db.event.findUniqueOrThrow({
    where: { id: eventId },
    select: {
      title: true,
      description: true,
      start_at: true,
      end_at: true,
      store: {
        select: {
          lineBotConfig: {
            select: {
              lineUserId: true,
              lineChannelAccessToken: true,
            },
          },
        },
      },
    },
  });

  console.log(event.store.lineBotConfig);

  if (!event.store.lineBotConfig) {
    return;
  }

  const lineBot = new LineBot({
    channelAccessToken: event.store.lineBotConfig.lineChannelAccessToken,
    lineUserId: event.store.lineBotConfig.lineUserId,
  });

  lineBot.pushMessageToAllChat([
    {
      type: "text",
      text: `${event.title}`,
    },
    {
      type: "text",
      text: `${event.description}`,
    },
  ]);
};
