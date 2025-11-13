import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { createSoftDeleteExtension } from "prisma-extension-soft-delete";
import { datatableFetchExtension } from "./prismaExtensions/Datatable";

const prismaClientSingleton = () => {
  const prisma = new PrismaClient()
    .$extends(withAccelerate())
    .$extends(datatableFetchExtension)
    .$extends(
      createSoftDeleteExtension({
        models: {
          Product: true,
        },
        defaultConfig: {
          field: "deleted_at",
          createValue: (deleted) => {
            if (deleted) return new Date();
            return null;
          },
        },
      })
    );

  return prisma;
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const db = globalThis.prismaGlobal ?? prismaClientSingleton();

export default db;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = db;
