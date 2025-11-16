import * as line from "@line/bot-sdk";

class LineBot {
  private readonly messagingApi: line.messagingApi.MessagingApiClient;

  constructor() {
    this.messagingApi = new line.messagingApi.MessagingApiClient({
      channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN!,
    });
  }

  public pushMessageToAllChat(
    messages: line.TextMessage[],
    options?: {
      notificationDisabled?: boolean;
      customAggregationUnits?: string[];
    }
  ) {
    return this.messagingApi.pushMessage({
      to: process.env.LINE_USER_ID!,
      messages: messages,
      notificationDisabled: options?.notificationDisabled,
      customAggregationUnits: options?.customAggregationUnits,
    });
  }
}

line.middleware({
  channelSecret: process.env.LINE_CHANNEL_SECRET!,
});

const lineBotClientSingleton = () => {
  const lineBot = new LineBot();

  return lineBot;
};

declare const globalThis: {
  lineBotGlobal: ReturnType<typeof lineBotClientSingleton>;
} & typeof global;

const lineBot = globalThis.lineBotGlobal ?? lineBotClientSingleton();

export default lineBot;

if (process.env.NODE_ENV !== "production") globalThis.lineBotGlobal = lineBot;
