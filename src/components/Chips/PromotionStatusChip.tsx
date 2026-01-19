import { Chip, ChipProps } from "@mui/material";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";

export type PromotionStatusChipProps = {
  event: {
    start_at: Date | string;
    end_at: Date | string;
    disabled_at: Date | string | null;
  };
  variant?: ChipProps["variant"];
  size?: ChipProps["size"];
};

const PromotionStatusChip = ({
  event,
  variant = "outlined",
  size = "small",
}: PromotionStatusChipProps) => {
  const t = useTranslations("COMPONENTS.promotion_status");
  const now = dayjs();
  const start = dayjs(event.start_at);
  const end = dayjs(event.end_at);

  let status: "active" | "scheduled" | "expired" | "disabled" = "active";
  let color: ChipProps["color"] = "success";

  if (event.disabled_at) {
    status = "disabled";
    color = "error";
  } else if (now.isBefore(start)) {
    status = "scheduled";
    color = "info";
  } else if (now.isAfter(end)) {
    status = "expired";
    color = "default";
  }

  return <Chip label={t(status)} color={color} variant={variant} size={size} />;
};

export default PromotionStatusChip;
