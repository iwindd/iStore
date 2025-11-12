"use client";
import { Confirmation, useConfirm } from "@/hooks/use-confirm";
import { money } from "@/libs/formatter";
import {
  removeProductFromCart,
  setProductQuantity,
  type CartProduct,
} from "@/reducers/cartReducer";
import { DeleteTwoTone } from "@mui/icons-material";
import { IconButton, Input, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import React from "react";
import { useDispatch } from "react-redux";

const getBackgroundColor = (product: CartProduct, grow: boolean) => {
  const canOverstock = product.data?.category?.overstock || false;
  const productStock = product.data?.stock || 0;

  // OVERSTOCK
  if (product.quantity > productStock && canOverstock && grow)
    return "var(--mui-palette-Slider-errorTrack)";
  if (product.quantity > productStock && canOverstock)
    return "var(--mui-palette-Alert-errorStandardBg)";

  // FULL
  if (product.quantity >= productStock && !canOverstock && grow)
    return "var(--mui-palette-Slider-warningTrack)";
  if (product.quantity >= productStock && !canOverstock)
    return "var(--mui-palette-Alert-warningStandardBg)";

  // NORMAL
  if (grow) return "var(--mui-palette-Alert-successStandardBg)";
};

const CartProductChild = (product: CartProduct) => {
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
      <Grid xs={2}>
        <Input
          disableUnderline
          sx={{ width: "3em" }}
          inputProps={{ min: 0, style: { textAlign: "center" } }}
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
      <Grid xs={6}>
        <Typography noWrap={true}>{product.data?.label || "..."}</Typography>
      </Grid>
      <Grid xs={2}>
        <Typography>
          {money((product.data?.price || 0) * product.quantity)}
        </Typography>
      </Grid>
      <Grid xs={2}>
        <IconButton onClick={confirmation.handleOpen}>
          <DeleteTwoTone />
        </IconButton>
        <Confirmation {...confirmation.props} />
      </Grid>
    </Grid>
  );
};

export default CartProductChild;
