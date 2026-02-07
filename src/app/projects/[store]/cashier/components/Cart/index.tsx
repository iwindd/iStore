import { useAppDispatch, useAppSelector } from "@/hooks";
import { Confirmation, useConfirm } from "@/hooks/use-confirm";
import usePayment from "@/hooks/use-payment";
import useObtainPromotionOffer from "@/hooks/useObtainPromotionOffer";
import { money } from "@/libs/formatter";
import {
  CheckoutMode,
  clearProductCart,
  selectCartTotal,
  selectCheckoutMode,
  selectLoadingProducts,
  selectPreOrderProducts,
  selectProductList,
  selectTotalPreOrder,
  setCheckoutMode,
} from "@/reducers/cartReducer";
import {
  ArrowForward,
  DeleteSweep,
  DeleteSweepTwoTone,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Divider,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import CartPreorder from "./components/CartPreorder";
import CartProduct from "./components/CartProduct";
import CartPromotionOffer from "./components/CartPromotionOffer";

import { useTranslations } from "next-intl";

const CartSections = () => {
  const t = useTranslations("CASHIER.cart");
  const dispatch = useAppDispatch();
  const payment = usePayment();
  const cart = useAppSelector(selectProductList);
  const loadingProduct = useAppSelector(selectLoadingProducts);
  const cartPreOrder = useAppSelector(selectPreOrderProducts);
  const totalProduct = useAppSelector(selectCartTotal);
  const totalPreOrder = useAppSelector(selectTotalPreOrder);
  const checkoutMode = useAppSelector(selectCheckoutMode);
  const total = totalProduct + totalPreOrder;

  const confirmation = useConfirm({
    title: t("confirmation.clearCart.confirm_title"),
    text: t("confirmation.clearCart.confirm_text"),
    confirmProps: {
      color: "warning",
      startIcon: <DeleteSweepTwoTone />,
    },
    confirm: t("confirmation.clearCart.label"),
    onConfirm: async () => {
      dispatch(clearProductCart());
    },
  });

  const { mergedPromotionQuantities } = useObtainPromotionOffer({
    products: cart
      .filter((p) => p.productId !== undefined)
      .map((p) => ({ id: p.productId, quantity: p.quantity })),
  });

  const isClearDisabled = cart.length <= 0 && cartPreOrder.length <= 0;
  const isCheckoutDisabled =
    checkoutMode === CheckoutMode.CASHOUT
      ? cart.length + cartPreOrder.length <= 0
      : cart.length <= 0;

  return (
    <Stack
      sx={{
        width: "100%",
        borderColor: "divider",
        flexDirection: "column",
        zIndex: 10,
        borderRadius: 0,
        height: "100%",
        pb: 7,
      }}
    >
      {/* Cart Items List */}
      <Stack
        height={"100%"}
        flex={1}
        spacing={1}
        pb={1}
        sx={{
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {cart.length > 0 &&
          cart.map((product) => (
            <CartProduct key={product.cartId} product={product} />
          ))}

        {checkoutMode == CheckoutMode.CASHOUT && (
          <>
            {cartPreOrder.length > 0 &&
              cartPreOrder.map((product) => (
                <CartPreorder key={product.cartId} product={product} />
              ))}

            {mergedPromotionQuantities.length > 0 &&
              mergedPromotionQuantities.map((promotionQuantity) => (
                <CartPromotionOffer
                  key={
                    promotionQuantity.id +
                    promotionQuantity.promotion_offer_id.join("-")
                  }
                  promotion={promotionQuantity}
                />
              ))}
          </>
        )}

        {cart.length <= 0 &&
          ((mergedPromotionQuantities.length <= 0 &&
            cartPreOrder.length <= 0) ||
            checkoutMode == CheckoutMode.CONSIGNMENT) && (
            <Stack
              height={"100%"}
              width={"100%"}
              justifyContent={"center"}
              alignItems={"center"}
              flex={1}
            >
              <Typography variant="h6" color="text.secondary">
                {t("empty")}
              </Typography>
            </Stack>
          )}
      </Stack>

      {/* Cart Footer Summary */}
      <Box>
        <Stack spacing={1} mb={2}>
          {totalPreOrder > 0 && checkoutMode == CheckoutMode.CASHOUT && (
            <>
              <Stack direction={"row"} justifyContent={"space-between"}>
                <Typography variant="body1">{t("summary.products")}</Typography>
                <Typography
                  variant="body1"
                  fontWeight={800}
                  color="primary.main"
                >
                  {money(totalProduct)}
                </Typography>
              </Stack>
              <Stack direction={"row"} justifyContent={"space-between"}>
                <Typography variant="body1">{t("summary.preorder")}</Typography>
                <Typography
                  variant="body1"
                  fontWeight={800}
                  color="primary.main"
                >
                  {money(totalPreOrder)}
                </Typography>
              </Stack>
            </>
          )}
          <Divider sx={{ borderStyle: "dashed" }} />
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Typography variant="h6" fontWeight="bold">
              {t("summary.total")}
            </Typography>
            <Typography variant="h6" fontWeight={800} color="primary.main">
              {money(
                checkoutMode == CheckoutMode.CASHOUT ? total : totalProduct,
              )}
            </Typography>
          </Stack>
        </Stack>

        <Stack spacing={1}>
          <Stack direction={"row"} spacing={1}>
            <Button
              variant="outlined"
              color="error"
              sx={{
                width: 40,
                height: "100%",
                borderRadius: 1,
              }}
              onClick={confirmation.handleOpen}
              disabled={isClearDisabled}
            >
              <DeleteSweep />
            </Button>
            <Button
              variant="contained"
              fullWidth
              endIcon={<ArrowForward />}
              sx={{
                fontWeight: "bold",
              }}
              onClick={payment.toggle}
              loading={loadingProduct.length > 0}
              disabled={isCheckoutDisabled}
            >
              {checkoutMode === CheckoutMode.CASHOUT
                ? t("checkout")
                : t("consignment")}
            </Button>
          </Stack>
          <ToggleButtonGroup
            color="primary"
            exclusive
            value={checkoutMode}
            onChange={(_, value) => {
              if (value) dispatch(setCheckoutMode(value));
            }}
            fullWidth
          >
            <ToggleButton value={CheckoutMode.CASHOUT}>
              {t("checkout")}
            </ToggleButton>
            <ToggleButton value={CheckoutMode.CONSIGNMENT}>
              {t("consignment")}
            </ToggleButton>
          </ToggleButtonGroup>

          {checkoutMode == CheckoutMode.CONSIGNMENT &&
            cartPreOrder.length > 0 && (
              <Alert severity="warning">
                {t("warnings.preorder_consignment")}
              </Alert>
            )}

          {checkoutMode == CheckoutMode.CONSIGNMENT &&
            mergedPromotionQuantities.length > 0 && (
              <Alert severity="warning">
                {t("warnings.promotion_consignment")}
              </Alert>
            )}
        </Stack>
      </Box>

      {payment.dialog}
      <Confirmation {...confirmation.props} />
    </Stack>
  );
};

export default CartSections;
