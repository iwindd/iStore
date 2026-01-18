import Loading from "@/components/loading";
import { useAppSelector } from "@/hooks";
import useRelatedPromotionOffer from "@/hooks/useRelatedPromotionOffer";
import { date } from "@/libs/formatter";
import { CartProduct } from "@/reducers/cartReducer";
import { ArrowRightAlt } from "@mui/icons-material";
import { Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

const RelatedPromotionOfferTab = () => {
  const t = useTranslations("CASHIER.tabs.related_promotion");
  const cartProducts: CartProduct[] = useAppSelector(
    (state) => state.cart.products,
  );

  const { data: relatedPromotionOffers, isLoading } = useRelatedPromotionOffer({
    productIds: cartProducts.map((p) => p.id),
  });

  if (isLoading || !relatedPromotionOffers) {
    return <Loading centered m={5} />;
  }

  if (relatedPromotionOffers.length === 0) {
    return (
      <Typography color="text.secondary" align="center" py={4}>
        {t("empty")}
      </Typography>
    );
  }

  return (
    <Stack spacing={1}>
      {relatedPromotionOffers.map((offer) => {
        return (
          <Card
            key={offer.id}
            sx={{
              transition: "all 0.2s",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: (theme) => theme.shadows[2],
              },
            }}
          >
            <CardContent>
              <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
                {/* Buy Items */}
                <Box flex={1.2} width="100%">
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    gutterBottom
                    component="div"
                  >
                    {t("buy_items")}
                  </Typography>
                  <Stack spacing={0.5}>
                    {offer.buyItems.map((item) => (
                      <Stack
                        key={item.product.label}
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography variant="body2" fontWeight={500}>
                          {item.product.label}
                        </Typography>
                        <Chip
                          label={`x${item.quantity}`}
                          size="small"
                          variant="outlined"
                          sx={{ height: 20, fontSize: "0.7rem" }}
                        />
                      </Stack>
                    ))}
                  </Stack>
                </Box>

                {/* Arrow */}
                <Box sx={{ display: { xs: "none", md: "block" } }}>
                  <ArrowRightAlt color="action" />
                </Box>
                {/* Mobile Separator */}
                <Box
                  sx={{
                    display: { xs: "block", md: "none" },
                    width: "100%",
                    height: "1px",
                    bgcolor: "divider",
                  }}
                />

                {/* Get Items */}
                <Box flex={1} width="100%">
                  <Typography
                    variant="caption"
                    color="success.main"
                    gutterBottom
                    component="div"
                  >
                    {t("get_items")}
                  </Typography>
                  <Stack spacing={0.5}>
                    {offer.getItems.map((item) => (
                      <Stack
                        key={item.product.label}
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography variant="body2" color="success.main">
                          {item.product.label}
                        </Typography>
                        <Chip
                          label={`x${item.quantity}`}
                          size="small"
                          color="success"
                          variant="filled"
                          sx={{ height: 20, fontSize: "0.7rem" }}
                        />
                      </Stack>
                    ))}
                  </Stack>
                </Box>

                {/* Date */}
              </Stack>
              <Stack
                minWidth={100}
                sx={{
                  textAlign: { xs: "left", md: "right" },
                  width: { xs: "100%", md: "auto" },
                }}
                direction="row"
                mt={2}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  {t("expires")} {date(offer.event.end_at, { withTime: false })}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );
};

export default RelatedPromotionOfferTab;
