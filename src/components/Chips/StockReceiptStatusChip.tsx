import { Chip, ChipProps } from "@mui/material";
import { StockReceiptStatus } from "@prisma/client";
import { useTranslations } from "next-intl";

interface StockReceiptStatusChipProps extends Omit<
  ChipProps,
  "label" | "color"
> {
  status: StockReceiptStatus;
}

const StockReceiptStatusChip = ({
  status,
  ...props
}: StockReceiptStatusChipProps) => {
  const t = useTranslations("STOCKS.status");

  const getColor = (): ChipProps["color"] => {
    switch (status) {
      case StockReceiptStatus.CREATING:
      case StockReceiptStatus.DRAFT:
        return "secondary";
      case StockReceiptStatus.PROCESSING:
        return "warning";
      case StockReceiptStatus.COMPLETED:
        return "success";
      case StockReceiptStatus.CANCEL:
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Chip
      size="small"
      variant="outlined"
      label={t(status)}
      color={getColor()}
      {...props}
    />
  );
};

export default StockReceiptStatusChip;
