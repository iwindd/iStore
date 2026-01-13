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

const OPTIONS = [
  {
    value: StockReceiptImportType.FromMinStockAlert,
    label: "สินค้าที่ต่ำกว่าค่าแจ้งเตือนสต๊อก",
  },
  {
    value: StockReceiptImportType.FromMinStockValue,
    label: "สินค้าที่ต่ำกว่ากำหนด",
  },
];

const StockReceiptImportSelect = ({
  slotProps,
  label = "ประเภทการนำเข้า",
  ...selectProps
}: {
  slotProps?: {
    formControl?: FormControlProps;
    inputLabel?: InputLabelProps;
    menuItem?: MenuItemProps;
  };
} & SelectProps) => {
  return (
    <FormControl {...slotProps?.formControl}>
      <InputLabel
        {...slotProps?.inputLabel}
        id={selectProps.labelId || "stock-receipt-import-tool-select-label"}
      >
        {label}
      </InputLabel>
      <Select
        labelId={
          selectProps.labelId || "stock-receipt-import-tool-select-label"
        }
        label={label}
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
