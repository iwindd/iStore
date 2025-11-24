"use server";

import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { LineBotValues } from "@/schema/LineBot";

const GetLineBotConfig = async (): Promise<
  ActionResponse<LineBotValues | null>
> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    if (!user.store) throw new Error("Store not found");

    const config = await db.lineBotConfig.findUnique({
      where: {
        store_id: user.store,
      },
    });

    if (!config) return { success: true, data: null };

    return {
      success: true,
      data: {
        lineUserId: config.lineUserId,
        lineChannelAccessToken: config.lineChannelAccessToken,
        lineChannelSecret: config.lineChannelSecret,
      },
    };
  } catch (error) {
    return ActionError(error) as ActionResponse<LineBotValues | null>;
  }
};

export default GetLineBotConfig;
