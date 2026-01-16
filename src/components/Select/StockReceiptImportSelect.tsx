import { StockReceiptImportType } from "@/schema/StockReceiptImport";
import {
  FormControl,
  FormControlProps,
  InputLabel,
  InputLabelProps,
  MenuItem,
  MenuItemProps,
  Select,
  SelectProps,
} from "@mui/material";
import { useTranslations } from "next-intl";

const StockReceiptImportSelect = ({
  slotProps,
  label,
  ...selectProps
}: {
  slotProps?: {
    formControl?: FormControlProps;
    inputLabel?: InputLabelProps;
    menuItem?: MenuItemProps;
  };
} & SelectProps) => {
  const t = useTranslations("STOCKS.tool_dialog.import_select");

  const OPTIONS = [
    {
      value: StockReceiptImportType.FromMinStockAlert,
      label: t("options.min_stock_alert"),
    },
    {
      value: StockReceiptImportType.FromMinStockValue,
      label: t("options.min_stock_value"),
    },
  ];

  const displayLabel = label || t("label");

  return (
    <FormControl {...slotProps?.formControl}>
      <InputLabel
        {...slotProps?.inputLabel}
        id={selectProps.labelId || "stock-receipt-import-tool-select-label"}
      >
        {displayLabel}
      </InputLabel>
      <Select
        labelId={
          selectProps.labelId || "stock-receipt-import-tool-select-label"
        }
        label={displayLabel}
        {...selectProps}
      >
        {OPTIONS.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default StockReceiptImportSelect;
