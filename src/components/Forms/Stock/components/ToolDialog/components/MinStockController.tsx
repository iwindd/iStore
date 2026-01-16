"use client";
import { StockReceiptImportValues } from "@/schema/StockReceiptImport";
import { Stack, TextField } from "@mui/material";
import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";

const MinStockController = ({
  formTool: {
    register,
    formState: { errors },
  },
}: {
  formTool: UseFormReturn<StockReceiptImportValues>;
}) => {
  const t = useTranslations("STOCKS.tool_dialog.min_stock");
  const error = "value" in errors ? errors.value : undefined;

  return (
    <Stack spacing={1}>
      <TextField
        type="number"
        label={t("label")}
        placeholder={t("placeholder")}
        {...register("value", { valueAsNumber: true })}
        autoFocus
        helperText={error?.message}
        error={!!error}
      />
    </Stack>
  );
};

export default MinStockController;
