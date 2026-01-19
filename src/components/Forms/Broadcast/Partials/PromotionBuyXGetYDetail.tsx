import { Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useTranslations } from "next-intl";

interface ProductItem {
  product: {
    id: number;
    label: string;
  };
  quantity: number;
}

export interface PromotionBuyXGetYDetailProps {
  buyItems: ProductItem[];
  getItems: ProductItem[];
}

const PromotionBuyXGetYDetail = ({
  buyItems,
  getItems,
}: PromotionBuyXGetYDetailProps) => {
  const t = useTranslations("BROADCASTS.form.sections.promotion_selection");
  return (
    <Card variant="outlined" sx={{ mt: 2 }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid size={6}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              {t("buy")}
            </Typography>
            <Stack spacing={1}>
              {buyItems.map((item) => (
                <Stack
                  key={item.product.id}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="body2">{item.product.label}</Typography>
                  <Chip label={`x${item.quantity}`} size="small" />
                </Stack>
              ))}
            </Stack>
          </Grid>
          <Grid size={6}>
            <Typography variant="subtitle2" color="success.main" gutterBottom>
              {t("get")}
            </Typography>
            <Stack spacing={1}>
              {getItems.map((item) => (
                <Stack
                  key={item.product.id}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="body2">{item.product.label}</Typography>
                  <Chip
                    label={`x${item.quantity}`}
                    size="small"
                    color="success"
                    variant="outlined"
                  />
                </Stack>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PromotionBuyXGetYDetail;
