"use client";
import React from "react";
import { IconButton, Input, Typography } from "@mui/material";
import { DeleteTwoTone } from "@mui/icons-material";
import { CartItem, CartState } from "@/atoms/cart";
import { useRecoilState } from "recoil";
import { Confirmation, useConfirm } from "@/hooks/use-confirm";
import { money } from "@/libs/formatter";
import Grid from "@mui/material/Unstable_Grid2";

const getRealCount = (item: CartItem) => {
  const canOverstock = item.category?.overstock;
  const isOverstock = item.count > item.stock;

  if (!canOverstock && isOverstock) return item.stock;
  return item.count;
};

const getBackgroundColor = (item: CartItem, grow: boolean) => {
  const canOverstock = item.category?.overstock || false;

  // OVERSTOCK
  if (item.count > item.stock && canOverstock && grow)
    return "var(--mui-palette-Slider-errorTrack)";
  if (item.count > item.stock && canOverstock)
    return "var(--mui-palette-Alert-errorStandardBg)";

  // FULL
  if (item.count >= item.stock && !canOverstock && grow)
    return "var(--mui-palette-Slider-warningTrack)";
  if (item.count >= item.stock && !canOverstock)
    return "var(--mui-palette-Alert-warningStandardBg)";

  // NORMAL
  if (grow) return "var(--mui-palette-Alert-successStandardBg)";
};

export const Item = (product: CartItem) => {
  const [grow, setGrow] = React.useState<boolean>(false);
  const [, setCart] = useRecoilState(CartState);
  const count = getRealCount(product);
  const prevCountRef = React.useRef(product.count);

  const confirmation = useConfirm({
    title: "แจ้งเตือน",
    text: "คุณต้องการที่จะลบสินค้าหรือไม่ ?",
    confirmProps: {
      startIcon: <DeleteTwoTone />,
      color: "error",
    },
    onConfirm: async () =>
      setCart((prev) => prev.filter((i) => i.serial != product.serial)),
  });

  function limitNumberWithinRange(num: number, min: number) {
    const MIN = min ?? 1;
    return Math.max(+num, MIN);
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCart((prevCart) => {
      return prevCart.map((item) =>
        item.serial === product.serial
          ? { ...item, count: limitNumberWithinRange(+e.target.value, 1) }
          : item
      );
    });
  };

  React.useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    if (product.count > prevCountRef.current) {
      setGrow(true);
      timeout = setTimeout(() => {
        setGrow(false);
      }, 200);
    }

    prevCountRef.current = product.count;

    return () => {
      if (timeout) {
        clearTimeout(timeout);
        setGrow(false);
      }
    };
  }, [product.count]);

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
          value={count}
          onChange={onChange}
        />
      </Grid>
      <Grid xs={6}>
        <Typography noWrap={true}>{product.label}</Typography>
      </Grid>
      <Grid xs={2}>
        <Typography>{money(product.price * count)}</Typography>
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
