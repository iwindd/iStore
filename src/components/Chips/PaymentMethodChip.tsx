"use client";

import { AccountBalanceTwoTone, PaymentsTwoTone } from "@mui/icons-material";
import { Chip, ChipProps } from "@mui/material";
import { Method } from "@prisma/client";
import { useTranslations } from "next-intl";

interface PaymentMethodChipProps {
  method: Method;
  size?: ChipProps["size"];
}

const PaymentMethodChip = ({
  method,
  size = "small",
}: PaymentMethodChipProps) => {
  const t = useTranslations("COMMON.payment_method");

  switch (method) {
    case "CASH":
      return (
        <Chip
          label={t("cash")}
          color="success"
          size={size}
          icon={<PaymentsTwoTone />}
          variant="outlined"
        />
      );
    case "BANK":
      return (
        <Chip
          label={t("bank")}
          color="info"
          size={size}
          icon={<AccountBalanceTwoTone />}
          variant="outlined"
        />
      );
    default:
      return <Chip label={method} size={size} />;
  }
};

export default PaymentMethodChip;
