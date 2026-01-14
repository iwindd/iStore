import {
  CheckCircleTwoTone,
  CloseTwoTone,
  LocalShippingTwoTone,
} from "@mui/icons-material";
import { Chip, ChipProps } from "@mui/material";
import { PreOrderStatus } from "@prisma/client";

interface PreOrderStatusChipProps extends Omit<ChipProps, "label" | "color"> {
  status: PreOrderStatus | string;
}

const PreOrderStatusChip = ({ status, ...props }: PreOrderStatusChipProps) => {
  const getStatusInfo = () => {
    switch (status) {
      case PreOrderStatus.PENDING:
        return {
          label: "รอส่งคืน",
          color: "primary" as const,
          icon: <LocalShippingTwoTone />,
        };
      case PreOrderStatus.RETURNED:
        return {
          label: "ส่งคืนแล้ว",
          color: "success" as const,
          icon: <CheckCircleTwoTone />,
        };
      case PreOrderStatus.CANCELLED:
        return {
          label: "ยกเลิกแล้ว",
          color: "default" as const,
          icon: <CloseTwoTone />,
        };
      default:
        return { label: status, color: "default" as const, icon: undefined };
    }
  };

  const { label, color, icon } = getStatusInfo();

  return (
    <Chip label={label} color={color} icon={icon} size="small" {...props} />
  );
};

export default PreOrderStatusChip;
