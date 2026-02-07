import { useAppDispatch } from "@/hooks";
import { CartProduct, setProductQuantity } from "@/reducers/cartReducer";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { IconButton, InputBase, Stack } from "@mui/material";
import { useEffect, useState } from "react";

const NumberStepper = ({
  product: { quantity, cartId, data, isLoading },
}: {
  product: CartProduct;
}) => {
  const [value, setValue] = useState<string | number>(quantity);
  const dispatch = useAppDispatch();
  const stockCount = data?.stock?.quantity || quantity;
  const disabled = isLoading || !data;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setValue(e.target.value);

  const handleBlur = () => {
    let parseValue = Number(value);

    if (Number.isNaN(parseValue)) parseValue = quantity;
    if (parseValue > stockCount) parseValue = stockCount;
    if (parseValue < 1) parseValue = 1;

    setValue(parseValue);

    dispatch(setProductQuantity({ cartId, quantity: parseValue }));
  };

  useEffect(() => {
    setValue(quantity);
  }, [quantity]);

  return (
    <Stack
      sx={{
        width: 40,
        maxHeight: 50,
        position: "relative",
        color: "secondary.main",
        "& .stepper-btn": {
          opacity: 0,
          pointerEvents: "none",
          transition: "opacity 0.2s ease",
        },
        "&:hover .stepper-btn": {
          opacity: 1,
          pointerEvents: "auto",
        },
      }}
      justifyContent={"space-between"}
    >
      <IconButton
        size="small"
        onClick={() =>
          dispatch(setProductQuantity({ cartId, quantity: quantity + 1 }))
        }
        className="stepper-btn"
        disabled={disabled}
        sx={{
          width: "100%",
          height: 12,
          borderRadius: 0,
          zIndex: 10,
        }}
      >
        <ExpandLess />
      </IconButton>
      <InputBase
        value={value}
        sx={{ width: "100%", padding: 0 }}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={quantity.toString()}
        disabled={disabled}
        inputProps={{
          sx: {
            textAlign: "center",
            padding: 0,
            position: "absolute",
            fontSize: 19,
          },
        }}
      />
      <IconButton
        size="small"
        onClick={() =>
          dispatch(setProductQuantity({ cartId, quantity: quantity - 1 }))
        }
        className="stepper-btn"
        disabled={disabled}
        sx={{
          width: "100%",
          height: 12,
          borderRadius: 0,
          zIndex: 10,
        }}
      >
        <ExpandMore />
      </IconButton>
    </Stack>
  );
};

export default NumberStepper;
