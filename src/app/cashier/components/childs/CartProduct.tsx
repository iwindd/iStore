"use client";
import { Confirmation, useConfirm } from "@/hooks/use-confirm";
import { money } from "@/libs/formatter";
import {
  removeProductFromCart,
  setProductQuantity,
} from "@/reducers/cartReducer";
import { DeleteTwoTone } from "@mui/icons-material";
import { IconButton, Input, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import React from "react";
import { useDispatch } from "react-redux";

interface CartProductChildProps {
  id: number;
  label: string;
  quantity: number;
  price: number;
  stock: number;
  canOverstock?: boolean;
}

const getBackgroundColor = (
  { canOverstock = false, stock, quantity }: CartProductChildProps,
  grow: boolean
) => {
  // OVERSTOCK
  if (quantity > stock && canOverstock && grow)
    return "var(--mui-palette-Slider-errorTrack)";
  if (quantity > stock && canOverstock)
    return "var(--mui-palette-Alert-errorStandardBg)";

  // FULL
  if (quantity >= stock && !canOverstock && grow)
    return "var(--mui-palette-Slider-warningTrack)";
  if (quantity >= stock && !canOverstock)
    return "var(--mui-palette-Alert-warningStandardBg)";

  // NORMAL
  if (grow) return "var(--mui-palette-Alert-successStandardBg)";
};

const CartProductChild = (product: CartProductChildProps) => {
  const [grow, setGrow] = React.useState<boolean>(false);
  const prevCountRef = React.useRef<number>(product.quantity);
  const dispatch = useDispatch();
  const confirmation = useConfirm({
    title: "แจ้งเตือน",
    text: "คุณต้องการที่จะลบสินค้าหรือไม่ ?",
    confirmProps: {
      startIcon: <DeleteTwoTone />,
      color: "error",
    },
    onConfirm: async () => dispatch(removeProductFromCart(product.id)),
  });

  React.useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    if (product.quantity > prevCountRef.current) {
      setGrow(true);
      timeout = setTimeout(() => {
        setGrow(false);
      }, 200);
    }

    prevCountRef.current = product.quantity;

    return () => {
      if (timeout) {
        clearTimeout(timeout);
        setGrow(false);
      }
    };
  }, [product.quantity]);

  return (
    <Grid
      key={product.id}
      container
      alignItems="center"
      sx={{
        background: getBackgroundColor(product, grow),
      }}
    >
      <Grid size={1}>
        <Input
          disableUnderline
          sx={{ width: "100%" }}
          inputProps={{ min: 0, style: { textAlign: "left" } }}
          type="number"
          value={product.quantity}
          onChange={(e) => {
            dispatch(
              setProductQuantity({
                id: product.id,
                quantity: Number(e.target.value),
              })
            );
          }}
        />
      </Grid>
      <Grid size={7}>
        <Typography noWrap={true}>{product.label}</Typography>
      </Grid>
      <Grid size={2} alignItems="right">
        {product.price > 0 ? (
          <Typography>{money(product.price * product.quantity)}</Typography>
        ) : (
          <Typography color={"green"}>ฟรี</Typography>
        )}
      </Grid>
      <Grid size={2}>
        <IconButton onClick={confirmation.handleOpen}>
          <DeleteTwoTone />
        </IconButton>
        <Confirmation {...confirmation.props} />
      </Grid>
    </Grid>
  );
};

export default CartProductChild;
