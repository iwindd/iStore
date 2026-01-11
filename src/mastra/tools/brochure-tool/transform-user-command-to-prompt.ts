import { createTool } from "@mastra/core";
import z from "zod";

export const transformUserCommandToPromptTool = createTool({
  id: "transform-user-command-to-prompt",
  description: "Transform user command to prompt for brochure generation",
  inputSchema: z.object({
    command: z.string().describe("The command to transform"),
  }),
  outputSchema: z.object({
    prompt: z.string().describe("The transformed prompt"),
  }),
  execute: async ({ context, mastra }) => {
    const { command } = context;

    try {
      const brochureAgent = mastra?.getAgent("brochureAgent");
      if (!brochureAgent) {
        throw new Error("Brochure agent not found");
      }

      const prompt = await brochureAgent.generate([
        {
          role: "user",
          content: command,
        },
      ]);

      return {
        prompt: prompt.text,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("❌ Prompt transformation failed:", errorMessage);
      throw new Error(`Failed to transform prompt: ${errorMessage}`);
    }
  },
});
