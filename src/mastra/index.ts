import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";

import { assistantAgent } from "./agents/assistant-agent";
import { brochureAgent } from "./agents/brochure-agent";
import { mastraStorage } from "./store";
import { generateBrochureWorkflow } from "./workflows/brochure-generate-workflow";

export const mastra = new Mastra({
  agents: { assistantAgent, brochureAgent },
  workflows: { generateBrochureWorkflow },
  storage: mastraStorage,
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
  telemetry: {
    // Telemetry is deprecated and will be removed in the Nov 4th release
    enabled: false,
  },
  observability: {
    // DefaultExporter and CloudExporter for AI tracing
    default: { enabled: false },
  },
});
