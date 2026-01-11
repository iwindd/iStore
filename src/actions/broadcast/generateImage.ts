"use server";

import { mastra } from "@/mastra";
import {
  AiImagePromptSchema,
  AiImagePromptValues,
} from "@/schema/Broadcast/AiImage";

export const generateImageAction = async (data: AiImagePromptValues) => {
  const validation = AiImagePromptSchema.safeParse(data);

  if (!validation.success) {
    return {
      success: false,
      message: validation.error.message,
    };
  }

  try {
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
      imageUrl: result.result.imageUrl,
    };
  } catch (error: any) {
    console.error("Error generating image:", error);
    return {
      success: false,
      message: error.message || "Failed to generate image",
    };
  }
};
