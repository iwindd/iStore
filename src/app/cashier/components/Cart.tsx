"use client";
import { useAppSelector } from "@/hooks";
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

  return (
    <Stack spacing={1}>
      <Typography variant="body1">ตะกร้าสินค้า :</Typography>
      {hasSomeProductOverstock && (
        <Alert severity="error">
          สินค้าสีแดงเป็นสินค้าที่สต๊อกคงเหลือไม่เพียงพอและระบบจะทำการค้างสินค้าไว้
          คุณสามารถจัดการได้ภายหลังที่เมนูสินค้าค้าง
        </Alert>
      )}

      <Stack
        sx={{
          width: "100%",
          height: 360,
          bgcolor: "background.paper",
          overflowY: "auto",
        }}
      >
        {cart.length > 0 ? (
          cart.map((product) => (
            <CartProductChild key={product.id} {...product} />
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
    </Stack>
  );
};

export default Cart;
