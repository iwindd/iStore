"use server";

import { AiImagePromptValues } from "@/schema/Broadcast/AiImage";
import { NextResponse } from "next/server";

export const generateImageAction = async (
  storeSlug: string,
  data: AiImagePromptValues,
) => {
  return NextResponse.json({
    message: "Deprecated",
  });
  /*   try {
    const ctx = await getPermissionContext(storeSlug);
    assertStoreCan(ctx, PermissionConfig.store.broadcast.generateContent);

    const validation = AiImagePromptSchema.safeParse(data);

    if (!validation.success) {
      return {
        success: false,
        message: validation.error.message,
      };
    }
    const workflow = mastra.getWorkflow("generateBrochureWorkflow");
    const run = await workflow.createRunAsync();

    const result = await run.start({
      inputData: {
        command: data.prompt,
      },
    });

    console.log("Success generating image:", result);

    return {
      success: true,
      // @ts-ignore
      imageUrl: result.result.imageUrl,
    };
  } catch (error: any) {
    console.error("Error generating image:", error);
    return {
      success: false,
      message: error.message || "Failed to generate image",
    };
  } */
};
