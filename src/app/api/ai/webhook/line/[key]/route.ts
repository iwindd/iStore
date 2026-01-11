import { getMessagingApiByKey } from "@/libs/line";
import * as line from "@line/bot-sdk";
import { NextResponse } from "next/server";
import crypto from "node:crypto";

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
          messagingApi.replyMessage({
            replyToken: event.replyToken,
            messages: [
              {
                type: "textV2",
                text: "pong!",
              },
            ],
          });
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
