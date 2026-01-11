import { getMessagingApiByKey } from "@/libs/line";
import { mastra } from "@/mastra";
import * as line from "@line/bot-sdk";
import { LineApplication } from "@prisma/client";
import { NextResponse } from "next/server";
import crypto from "node:crypto";

const onMessageEvent = async (
  application: LineApplication,
  event: line.MessageEvent,
  messagingApi: line.messagingApi.MessagingApiClient
) => {
  if (event.message.type != "text")
    return console.error("event.message.type is not text");

  if (event.source.type != "user")
    return console.error("event.source.type is not user");

  const agent = mastra.getAgent("assistantAgent");
  const result = await agent.generate(
    [
      {
        role: "system",
        content: `**เมื่อ Actions ถูกเรียกใช้แล้วต้องการค่า ApplicationId ให้ระบุ "${application.id}" เท่านั้น**`,
      },
      {
        role: "user",
        content: event.message.text,
      },
    ],
    event.source.userId
      ? {
          memory: {
            thread: `LINE-APPLICATION-${application.id}`,
            resource: event.source.userId,
          },
        }
      : undefined
  );

  if (!result.text) return console.error("result.text is empty");

  messagingApi.replyMessage({
    replyToken: event.replyToken,
    messages: [
      {
        type: "textV2",
        text: result.text,
      },
    ],
  });
};

export async function POST(
  req: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  const signature = req.headers.get("x-line-signature");

  if (!signature)
    return NextResponse.json({ message: "Missing signature" }, { status: 401 });

  try {
    const { messagingApi, application } = await getMessagingApiByKey(key);
    const bodyText = await req.text();

    const hash = crypto
      .createHmac("SHA256", application.channelSecret)
      .update(bodyText)
      .digest("base64");

    if (hash !== signature)
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 401 }
      );

    const body = JSON.parse(bodyText) as line.WebhookRequestBody;
    await Promise.all(
      body.events.map(async (event) => {
        if (event.type === "message") {
          await onMessageEvent(application, event, messagingApi);
        } else {
          console.error("event.type is not message", event);
        }
      })
    );

    return NextResponse.json(
      {
        name: application.name,
        created_at: application.created_at,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing line webhook:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
