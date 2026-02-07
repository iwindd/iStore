"use client";

import { Chip } from "@mui/material";
import { useTranslations } from "next-intl";

interface OrderProductTypeChipProps {
  type: OrderProductType;
}

export enum OrderProductType {
  PRODUCT = "PRODUCT",
  PREORDER = "PREORDER",
  PROMOTION = "PROMOTION",
}

const OrderProductTypeChip = ({ type }: OrderProductTypeChipProps) => {
  const t = useTranslations("HISTORIES.detail.datatable.types");

  switch (type) {
    case OrderProductType.PRODUCT:
      return <Chip label={t("product")} color="primary" size="small" />;
    case OrderProductType.PREORDER:
      return <Chip label={t("preorder")} color="secondary" size="small" />;
    case OrderProductType.PROMOTION:
      return <Chip label={t("promotion")} color="info" size="small" />;
    default:
      return <Chip label={type} size="small" />;
  }
};

export default OrderProductTypeChip;
