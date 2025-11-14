"use client";
import { useAppSelector } from "@/hooks";
import useObtainPromotionOffer from "@/hooks/useObtainPromotionOffer";
import { getQuantityByItem } from "@/libs/promotion";
import { CartProduct } from "@/reducers/cartReducer";
import {
  Alert,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import CartProductChild from "./childs/CartProduct";

const Cart = () => {
  const cart: CartProduct[] = useAppSelector((state) => state.cart.products);
  const hasSomeProductOverstock = useAppSelector(
    (state) => state.cart.hasSomeProductOverstock
  );
  const { data: obtainPromotionOffers } = useObtainPromotionOffer({
    products: cart.map((p) => ({ id: p.id, quantity: p.quantity })),
  });

  return (
    <Stack spacing={1}>
      <Typography variant="caption">ตะกร้าสินค้า :</Typography>
      {hasSomeProductOverstock && (
        <Alert severity="error">
          สินค้าสีแดงเป็นสินค้าที่สต๊อกคงเหลือไม่เพียงพอและระบบจะทำการค้างสินค้าไว้
          คุณสามารถจัดการได้ภายหลังที่เมนูสินค้าค้าง
        </Alert>
      )}

      <Stack
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          overflowY: "auto",
        }}
      >
        {cart.length > 0 ? (
          cart.map((product) => (
            <CartProductChild
              id={product.id}
              key={product.id}
              label={product.data?.label || "..."}
              quantity={product.quantity}
              price={product.data?.price || 0}
              canOverstock={product.data?.category?.overstock || false}
              stock={product.data?.stock || 0}
            />
          ))
        ) : (
          <ListItem>
            <ListItemText
              sx={{
                textAlign: "center",
              }}
              primary="ไม่มีสินค้าภายในตะกร้า"
            />
          </ListItem>
        )}
      </Stack>

      {obtainPromotionOffers && obtainPromotionOffers.length > 0 && (
        <>
          <Typography variant="caption">ได้รับสินค้าจากโปรโมชั่น :</Typography>
          <Stack
            sx={{
              width: "100%",
              bgcolor: "background.paper",
              overflowY: "auto",
            }}
          >
            {obtainPromotionOffers.map((offer) =>
              offer.getItems.map(({ id, quantity, product }) => (
                <CartProductChild
                  key={id}
                  id={product.id}
                  label={product.label}
                  quantity={getQuantityByItem(
                    product.id,
                    offer.buyItems,
                    offer.getItems,
                    cart
                  )}
                  price={0}
                  canOverstock={product.category?.overstock || false}
                  stock={product.stock || 0}
                  options={{
                    canRemoveFromCart: false,
                  }}
                />
              ))
            )}
          </Stack>
        </>
      )}
    </Stack>
  );
};

export default Cart;
