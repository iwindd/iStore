import { MergedPromotionQuantity } from "@/libs/promotion";
import { Paper, Stack, Tooltip, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

const CartPromotionOffer = ({
  promotion,
}: {
  promotion: MergedPromotionQuantity;
}) => {
  const t = useTranslations("CASHIER.cart");
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1,
        borderStyle: "dashed",
      }}
    >
      <Stack width={"100%"}>
        <Stack direction={"row"} spacing={1}>
          <Stack width={40} justifyContent={"center"}>
            <Typography
              sx={{
                textAlign: "center",
                fontSize: 19,
              }}
            >
              {promotion.quantity}
            </Typography>
          </Stack>
          <Stack flex={1} minWidth={0} mr={1}>
            <Typography variant="h6" fontWeight="bold" noWrap sx={{ pr: 1 }}>
              {promotion.data.label}
            </Typography>
            <Stack direction={"row"} spacing={1}>
              <Tooltip title={t("product.promotion_tooltip")}>
                <Typography variant="caption" color="warning" noWrap>
                  {t("product.promotion_label")}
                </Typography>
              </Tooltip>
              {promotion.data.serial && (
                <Typography variant="caption" color="text.secondary" noWrap>
                  {t("product.serial")} {promotion.data.serial}
                </Typography>
              )}
            </Stack>
          </Stack>

          <Stack justifyContent={"center"}>
            <Typography
              variant="h6"
              fontWeight="bold"
              whiteSpace="nowrap"
              color="success.main"
            >
              {t("product.free")}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default CartPromotionOffer;
