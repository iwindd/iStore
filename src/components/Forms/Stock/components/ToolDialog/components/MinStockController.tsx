"use client";
import { StockReceiptImportValues } from "@/schema/StockReceiptImport";
import { Stack, TextField } from "@mui/material";
import { UseFormReturn } from "react-hook-form";

const MinStockController = ({
  formTool: {
    register,
    formState: { errors },
  },
}: {
  formTool: UseFormReturn<StockReceiptImportValues>;
}) => {
  const error = "value" in errors ? errors.value : undefined;

  return (
    <Stack spacing={1}>
      <TextField
        type="number"
        label="จำนวนขั้นต่ำ"
        placeholder="จำนวนของสต๊อกขั้นต่ำที่ต้องการนำเข้า"
        {...register("value", { valueAsNumber: true })}
        autoFocus
        helperText={error?.message}
        error={!!error}
      />
    </Stack>
  );
};

export default MinStockController;
