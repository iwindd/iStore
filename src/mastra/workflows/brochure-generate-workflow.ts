import { createStep, createWorkflow } from "@mastra/core";
import { RuntimeContext } from "@mastra/core/runtime-context";
import z from "zod";
import { imageGeneratorTool } from "../tools/brochure-tool/generate-image";
import { transformUserCommandToPromptTool } from "../tools/brochure-tool/transform-user-command-to-prompt";

// Step 1: แปลงคำสั่งจากผู้ใช้เป็น prompt สำหรับ AI สร้างภาพ
const transformUserCommandToPromptStep = createStep<any, any, any, any, any>({
  id: "translate-user-command-to-prompt",
  description: "แปลงคำสั่งจากผู้ใช้เป็น prompt สำหรับ AI สร้างภาพ",
  inputSchema: z.object({
    command: z.string(),
  }),
  outputSchema: z.object({
    prompt: z.string(),
  }),
  execute: async ({ inputData, runtimeContext, mastra }) => {
    console.log("✍️ Generating ad copy...");

    const generatedPrompt = await transformUserCommandToPromptTool.execute({
      mastra,
      context: {
        command: inputData.command,
      },
      runtimeContext: runtimeContext || new RuntimeContext(),
    });

    console.log("Generated prompt:", generatedPrompt.prompt);

    return {
      prompt: generatedPrompt.prompt,
    };
  },
});

// Step 2: สร้างภาพ
const generateImageStep = createStep<any, any, any, any, any>({
  id: "generate-image",
  description: "สร้างภาพ",
  inputSchema: z.object({
    prompt: z.string(),
  }),
  outputSchema: z.object({
    imageUrl: z.string(),
  }),
  execute: async ({ inputData, runtimeContext, mastra }) => {
    console.log("✍️ Generating image...");

    const generatedImage = await imageGeneratorTool.execute({
      mastra,
      context: {
        prompt: inputData.prompt,
      },
      runtimeContext: runtimeContext || new RuntimeContext(),
    });

    console.log("Generated image:", generatedImage);

    return {
      imageUrl: generatedImage.imageUrl,
    };
  },
});

// MainWorkFlow
export const generateBrochureWorkflow = createWorkflow({
  id: "generate-brochure",
  inputSchema: z.object({
    command: z.string(),
  }),
  outputSchema: z.object({
    imageUrl: z.string(),
  }),
})
  .then(transformUserCommandToPromptStep)
  .then(generateImageStep)
  .commit();
