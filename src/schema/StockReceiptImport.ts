import z from "zod";

export const StockReceiptImportType = {
  FromMinStockAlert: "FromMinStockAlert",
  FromMinStockValue: "FromMinStockValue",
  FromStockId: "FromStockId",
} as const;

// ImportFromMinStockAlert
export const StockReceiptImportFromMinStockAlertSchema = z.object({
  type: z.enum([StockReceiptImportType.FromMinStockAlert]),
  useAlertCount: z.boolean().default(false),
});

export type StockReceiptImportFromMinStockAlertValues = z.infer<
  typeof StockReceiptImportFromMinStockAlertSchema
>;

// ImportFromMinStockValue
export const StockReceiptImportFromMinStockValueSchema = z.object({
  type: z.enum([StockReceiptImportType.FromMinStockValue]),
  value: z.number().min(1),
});

export type StockReceiptImportFromMinStockValueValues = z.infer<
  typeof StockReceiptImportFromMinStockValueSchema
>;

// ImportFromStockId
export const StockReceiptImportFromStockIdSchema = z.object({
  type: z.enum([StockReceiptImportType.FromStockId]),
  id: z.number(),
});

export type StockReceiptImportFromStockIdValues = z.infer<
  typeof StockReceiptImportFromStockIdSchema
>;

// StockReceiptImport
export const StockReceiptImportSchema = z.discriminatedUnion("type", [
  StockReceiptImportFromMinStockAlertSchema,
  StockReceiptImportFromMinStockValueSchema,
  StockReceiptImportFromStockIdSchema,
]);

export type StockReceiptImportValues = z.infer<typeof StockReceiptImportSchema>;
