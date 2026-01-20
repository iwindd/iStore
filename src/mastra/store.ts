import { Memory } from "@mastra/memory";
import { PgVector, PostgresStore } from "@mastra/pg";

declare global {
  var __mastraStorage__: PostgresStore | undefined;
  var __assistantAgentMemory__: Memory | undefined;
}

export const mastraStorage =
  globalThis.__mastraStorage__ ??
  new PostgresStore({
    connectionString: process.env.AI_DATABASE_URL!,
    schemaName: "mastra",
  });

export const assistantAgentMemory =
  globalThis.__assistantAgentMemory__ ??
  new Memory({
    storage: mastraStorage,
    vector: new PgVector({
      connectionString: process.env.AI_DATABASE_URL!,
      schemaName: "memory",
    }),
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__mastraStorage__ = mastraStorage;
  globalThis.__assistantAgentMemory__ = assistantAgentMemory;
}
