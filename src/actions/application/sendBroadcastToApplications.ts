"use server";
import db from "@/libs/db";
import * as line from "@line/bot-sdk";

const sendBroadcastToApplications = async (
  store_id: string,
  payload: {
    message: string;
    image_url?: string;
  }
) => {
  const applications = await db.lineApplication.findMany({
    where: {
      store_id,
      useAsBroadcast: true,
    },
    select: {
      channelAccessToken: true,
    },
  });

  const clients = applications.map((application) => {
    return new line.messagingApi.MessagingApiClient({
      channelAccessToken: application.channelAccessToken,
    });
  });

  const messages: line.messagingApi.Message[] = [
    {
      type: "textV2",
      text: payload.message,
    },
  ];

  if (payload.image_url) {
    messages.unshift({
      type: "image",
      originalContentUrl: payload.image_url,
      previewImageUrl: payload.image_url,
    });
  }

  clients.forEach((client) => {
    client.broadcast({
      messages,
    });
  });
};

export default sendBroadcastToApplications;
