import { Chip, ChipProps } from "@mui/material";
import { BroadcastStatus } from "@prisma/client";
import { useTranslations } from "next-intl";

interface BroadcastStatusChipProps extends Omit<ChipProps, "label" | "color"> {
  status: BroadcastStatus;
}

const BroadcastStatusChip = ({
  status,
  variant = "outlined",
  size = "small",
  ...props
}: BroadcastStatusChipProps) => {
  const t = useTranslations("BROADCASTS.datatable.status");

  const getColor = (): ChipProps["color"] => {
    switch (status) {
      case BroadcastStatus.DRAFT:
        return "default";
      case BroadcastStatus.SCHEDULED:
        return "info";
      case BroadcastStatus.SENT:
        return "success";
      case BroadcastStatus.CANCELLED:
        return "warning";
      case BroadcastStatus.FAILED:
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Chip
      label={t(status)}
      color={getColor()}
      variant={variant}
      size={size}
      {...props}
    />
  );
};

export default BroadcastStatusChip;
