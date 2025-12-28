"use server";

import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";

export interface ApiKeyResponse {
  apiKey: string | null;
}

const GetApiKey = async (): Promise<ActionResponse<ApiKeyResponse>> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    if (!user.store) throw new Error("Store not found");

    const store = await db.store.findUnique({
      where: {
        id: user.store,
      },
      select: {
        api_key: true,
      },
    });

    if (!store) throw new Error("Store not found");

    return {
      success: true,
      data: {
        apiKey: store.api_key,
      },
    };
  } catch (error) {
    return ActionError(error) as ActionResponse<ApiKeyResponse>;
  }
};

export default GetApiKey;
