"use client";
import {
  Alert,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { useRecoilState } from "recoil";
import { CartState } from "../../../atoms/cart";
import { Item } from "./childs/CartItem";

const Cart = () => {
  const [cart] = useRecoilState(CartState);

  return (
    <Stack spacing={1}>
      <Typography variant="body1">ตะกร้าสินค้า :</Typography>
      {cart.some((val) => val.category?.overstock && val.count > val.stock) && (
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
          cart.map((product) => <Item key={product.id} {...product} />)
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
