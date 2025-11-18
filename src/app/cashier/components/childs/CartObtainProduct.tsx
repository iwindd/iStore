"use client";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import React from "react";

interface CartObtainProductProps {
  id: number;
  label: string;
  quantity: number;
  stock: number;
  canOverstock?: boolean;
}

const getBackgroundColor = (
  { canOverstock = false, stock, quantity }: CartObtainProductProps,
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

const CartObtainProduct = (product: CartObtainProductProps) => {
  const [grow, setGrow] = React.useState<boolean>(false);
  const prevCountRef = React.useRef<number>(product.quantity);

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
        <Typography align="left">{product.quantity}</Typography>
      </Grid>
      <Grid size={7}>
        <Typography noWrap={true}>{product.label}</Typography>
      </Grid>
      <Grid size={4} alignItems="right">
        <Typography color={"green"}>ฟรี</Typography>
      </Grid>
    </Grid>
  );
};

export default CartObtainProduct;
