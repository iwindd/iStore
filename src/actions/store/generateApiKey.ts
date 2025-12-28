"use server";

import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import crypto from "node:crypto";

export interface GenerateApiKeyResponse {
  apiKey: string;
}

const GenerateApiKey = async (): Promise<
  ActionResponse<GenerateApiKeyResponse>
> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    if (!user.store) throw new Error("Store not found");

    // Generate a unique API key
    const apiKey = `iS${crypto.randomBytes(16).toString("hex")}`;

    await db.store.update({
      where: {
        id: user.store,
      },
      data: {
        api_key: apiKey,
      },
    });

    return {
      success: true,
      data: {
        apiKey,
      },
    };
  } catch (error) {
    return ActionError(error) as ActionResponse<GenerateApiKeyResponse>;
  }
};

export default GenerateApiKey;
