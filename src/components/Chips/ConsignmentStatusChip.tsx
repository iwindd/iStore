import { Chip, ChipProps } from "@mui/material";
import { ConsignmentStatus } from "@prisma/client";
import { useTranslations } from "next-intl";

interface ConsignmentStatusChipProps extends Omit<
  ChipProps,
  "label" | "color"
> {
  status: ConsignmentStatus;
}

const ConsignmentStatusChip = ({
  status,
  ...props
}: ConsignmentStatusChipProps) => {
  const t = useTranslations("CONSIGNMENTS.status");

  const getColor = (): ChipProps["color"] => {
    switch (status) {
      case ConsignmentStatus.PENDING:
        return "warning";
      case ConsignmentStatus.COMPLETED:
        return "success";
      case ConsignmentStatus.CANCELLED:
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Chip
      size="small"
      variant="outlined"
      label={t(status.toLowerCase())}
      color={getColor()}
      {...props}
    />
  );
};

export default ConsignmentStatusChip;
