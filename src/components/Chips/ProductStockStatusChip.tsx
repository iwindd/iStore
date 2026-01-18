import { Chip, ChipProps } from "@mui/material";
import { useTranslations } from "next-intl";

interface ProductStockStatusChipProps extends Omit<
  ChipProps,
  "label" | "color" | "variant"
> {
  quantity: number;
  useAlert?: boolean;
  alertCount?: number;
  usePreorder?: boolean;
}

const ProductStockStatusChip = ({
  quantity,
  useAlert = false,
  alertCount = 0,
  usePreorder = false,
  ...props
}: ProductStockStatusChipProps) => {
  const t = useTranslations("COMPONENTS.product_stock_status");

  if (usePreorder) {
    return (
      <Chip
        label={t("preorder")}
        size="small"
        color="info"
        variant="outlined"
        {...props}
      />
    );
  }

  if (quantity <= 0) {
    return (
      <Chip label={t("out_of_stock")} size="small" color="error" {...props} />
    );
  }

  if (useAlert && quantity <= alertCount) {
    return (
      <Chip label={t("low_stock")} size="small" color="warning" {...props} />
    );
  }

  return (
    <Chip
      label={t("in_stock")}
      size="small"
      color="success"
      variant="outlined"
      {...props}
    />
  );
};

export default ProductStockStatusChip;
