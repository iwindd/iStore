import { getMessagingApiByKey } from "@/libs/line";
import { mastra } from "@/mastra";
import { AssistantAgentContext } from "@/mastra/agents/assistant-agent";
import * as line from "@line/bot-sdk";
import { AgentExecutionOptions } from "@mastra/core/agent";
import { MessageListInput } from "@mastra/core/agent/message-list";
import { RuntimeContext } from "@mastra/core/runtime-context";
import { LineApplication } from "@prisma/client";
import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { NextResponse } from "next/server";
import crypto from "node:crypto";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(buddhistEra);

const onMessageEvent = async (
  application: LineApplication,
  messagingApi: line.messagingApi.MessagingApiClient,
  event: line.MessageEvent,
) => {
  if (event.message.type != "text")
    return console.error("event.message.type is not text");

  if (event.source.type != "user")
    return console.error("event.source.type is not user");

  const agent = mastra.getAgent("assistantAgent");
  const runtimeContext = new RuntimeContext<AssistantAgentContext>();
  runtimeContext.set("storeId", application.store_id);

  const messages: MessageListInput = [
    {
      role: "system",
      content: `
          วันที่ปัจจุบัน: ${dayjs().tz("Asia/Bangkok").locale("th").format("dddd ที่ D MMMM BBBB")}
          เวลาปัจจุบัน: ${dayjs().tz("Asia/Bangkok").format("HH:mm")}
        `,
    },
    {
      role: "user",
      content: event.message.text,
    },
  ];

  const options: AgentExecutionOptions<undefined, "mastra"> = {
    runtimeContext,
  };

  if (event.source.userId) {
    options.memory = {
      thread: `LINE-${event.source.userId}`,
      resource: event.source.userId,
    };
  }

  const result = await agent.generate(messages, options);
  if (!result.text) return console.error("result.text is empty");

  await messagingApi.replyMessage({
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
  { params }: { params: Promise<{ key: string }> },
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
        { status: 401 },
      );

    const body = JSON.parse(bodyText) as line.WebhookRequestBody;
    await Promise.all(
      body.events.map(async (event) => {
        if (event.type === "message") {
          await onMessageEvent(application, messagingApi, event);
        } else {
          console.error("event.type is not message", event);
        }
      }),
    );

    return NextResponse.json(
      {
        name: application.name,
        created_at: application.created_at,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing line webhook:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
