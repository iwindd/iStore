import * as line from "@line/bot-sdk";

export class LineBot {
  private readonly messagingApi: line.messagingApi.MessagingApiClient;
  private readonly channelAccessToken: string;
  private readonly lineUserId: string;

  constructor(lineConfig: { channelAccessToken: string; lineUserId: string }) {
    this.channelAccessToken = lineConfig.channelAccessToken;
    this.lineUserId = lineConfig.lineUserId;
    this.messagingApi = new line.messagingApi.MessagingApiClient({
      channelAccessToken: this.channelAccessToken,
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
      to: this.lineUserId,
      messages: messages,
      notificationDisabled: options?.notificationDisabled,
      customAggregationUnits: options?.customAggregationUnits,
    });
  }
}
