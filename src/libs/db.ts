import { PrismaClient } from "@prisma/client";
import { createSoftDeleteExtension } from "prisma-extension-soft-delete";
import { datatableFetchExtension } from "./prismaExtensions/Datatable";
import { promotionExtension } from "./prismaExtensions/Promotion";

export type Tx = Parameters<Parameters<typeof db.$transaction>[0]>[0];

const prismaClientSingleton = () => {
  const prisma = new PrismaClient()
    .$extends(datatableFetchExtension)
    .$extends(promotionExtension)
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
      }),
    );

  return prisma;
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const db = globalThis.prismaGlobal ?? prismaClientSingleton();

export default db;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = db;
