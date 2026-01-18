import { LabelTwoTone } from "@mui/icons-material";
import { Chip, ChipProps, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

interface ProductCategoryChipProps extends Omit<
  ChipProps,
  "label" | "icon" | "variant"
> {
  label?: string | null;
}

const ProductCategoryChip = ({ label, ...props }: ProductCategoryChipProps) => {
  const t = useTranslations("PRODUCTS.datatable");

  if (!label) {
    return (
      <Typography variant="caption" color="text.secondary">
        {t("no_category")}
      </Typography>
    );
  }

  return (
    <Chip
      label={label}
      size="small"
      variant="outlined"
      icon={<LabelTwoTone fontSize="small" />}
      {...props}
    />
  );
};

export default ProductCategoryChip;
