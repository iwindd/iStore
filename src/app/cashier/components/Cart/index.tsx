import { useAppDispatch, useAppSelector } from "@/hooks";
import { Confirmation, useConfirm } from "@/hooks/use-confirm";
import usePayment from "@/hooks/use-payment";
import useObtainPromotionOffer from "@/hooks/useObtainPromotionOffer";
import { money } from "@/libs/formatter";
import {
  CheckoutMode,
  clearProductCart,
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

const CartSections = () => {
  const dispatch = useAppDispatch();
  const payment = usePayment();
  const cart = useAppSelector((state) => state.cart.products);
  const cartPreOrder = useAppSelector((state) => state.cart.preOrderProducts);
  const total = useAppSelector((state) => state.cart.total);
  const checkoutMode = useAppSelector((state) => state.cart.checkoutMode);

  const confirmation = useConfirm({
    title: "แจ้งเตือน",
    text: "คุณต้องการจะล้างตะกร้าหรือไม่? สินค้าภายในตะกร้าจะถูกลบและไม่สามารถย้อนกลับได้!",
    confirmProps: {
      color: "warning",
      startIcon: <DeleteSweepTwoTone />,
    },
    confirm: "ล้างตะกร้า",
    onConfirm: async () => {
      dispatch(clearProductCart());
    },
  });

  const { mergedPromotionQuantities } = useObtainPromotionOffer({
    products: cart.map((p) => ({ id: p.id, quantity: p.quantity })),
  });

  return (
    <Stack
      sx={{
        width: "100%",
        borderColor: "divider",
        flexDirection: "column",
        zIndex: 10,
        borderRadius: 0,
      }}
    >
      {/* Cart Items List */}
      <Stack
        height={"40vh"}
        minHeight={"40vh"}
        maxHeight={"60vh"}
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
            <CartProduct key={product.id} product={product} />
          ))}

        {checkoutMode == CheckoutMode.CASHOUT && (
          <>
            {cartPreOrder.length > 0 &&
              cartPreOrder.map((product) => (
                <CartPreorder key={product.id} product={product} />
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
                ไม่มีสินค้าภายในตะกร้า
              </Typography>
            </Stack>
          )}
      </Stack>

      {/* Cart Footer Summary */}
      <Box>
        <Stack spacing={1} mb={2}>
          <Divider sx={{ borderStyle: "dashed" }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              pt: 1,
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              ยอดรวม
            </Typography>
            <Typography variant="h6" fontWeight={800} color="primary.main">
              {money(total)}
            </Typography>
          </Box>
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
            >
              {checkoutMode === CheckoutMode.CASHOUT ? "ชำระเงิน" : "ฝากขาย"}
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
            <ToggleButton value={CheckoutMode.CASHOUT}>ชำระเงิน</ToggleButton>
            <ToggleButton value={CheckoutMode.CONSIGNMENT}>ฝากขาย</ToggleButton>
          </ToggleButtonGroup>

          {checkoutMode == CheckoutMode.CONSIGNMENT &&
            cartPreOrder.length > 0 && (
              <Alert severity="warning">
                สินค้าพรีออเดอร์ไม่สามารถฝากขายได้
              </Alert>
            )}

          {checkoutMode == CheckoutMode.CONSIGNMENT &&
            mergedPromotionQuantities.length > 0 && (
              <Alert severity="warning">
                ไม่ได้รับสินค้าโปรโมชั่นเมื่อเป็นรายการฝากขาย
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
