import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";

import { assistantAgent } from "./agents/assistant-agent";
import { mastraStorage } from "./store";

export const mastra = new Mastra({
  agents: { assistantAgent },
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
