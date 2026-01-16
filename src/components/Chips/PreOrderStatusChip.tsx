import {
  CheckCircleTwoTone,
  CloseTwoTone,
  LocalShippingTwoTone,
} from "@mui/icons-material";
import { Chip, ChipProps } from "@mui/material";
import { PreOrderStatus } from "@prisma/client";
import { useTranslations } from "next-intl";

interface PreOrderStatusChipProps extends Omit<ChipProps, "label" | "color"> {
  status: PreOrderStatus;
}

const PreOrderStatusChip = ({ status, ...props }: PreOrderStatusChipProps) => {
  const t = useTranslations("COMPONENTS.preorder_status");
  const getStatusInfo = () => {
    switch (status) {
      case PreOrderStatus.PENDING:
        return {
          label: t("pending"),
          color: "primary" as const,
          icon: <LocalShippingTwoTone />,
        };
      case PreOrderStatus.RETURNED:
        return {
          label: t("returned"),
          color: "success" as const,
          icon: <CheckCircleTwoTone />,
        };
      case PreOrderStatus.CANCELLED:
        return {
          label: t("cancelled"),
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
