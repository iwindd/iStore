import env from "@/config/Env";
import { LineMessingApi } from "@/libs/line";
import * as line from "@line/bot-sdk";
import { NextResponse } from "next/server";
import crypto from "node:crypto";
export const runtime = "nodejs";

const onMessageEvent = async (event: line.MessageEvent) => {
  return LineMessingApi.replyMessage({
    replyToken: event.replyToken,
    messages: [
      {
        type: "textV2",
        text: "pong!",
      },
    ],
  });
};

export async function POST(req: Request) {
  const signature = req.headers.get("x-line-signature");

  if (!signature) {
    return NextResponse.json({ message: "Missing signature" }, { status: 401 });
  }
  const bodyText = await req.text();

  const hash = crypto
    .createHmac("sha256", env.line.channelSecret)
    .update(bodyText)
    .digest("base64");
  if (hash !== signature) {
    console.log(hash, signature);
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }

  const body = JSON.parse(bodyText) as line.WebhookRequestBody;
  body.events.forEach((event) => {
    if (event.type === "message") {
      onMessageEvent(event);
    }
  });

  return NextResponse.json({
    message: "OK",
  });
}
