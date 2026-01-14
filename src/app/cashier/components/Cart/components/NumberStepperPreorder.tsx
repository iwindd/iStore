import { useAppDispatch } from "@/hooks";
import {
  CartProduct,
  setProductPreOrderQuantity,
  setProductQuantity,
} from "@/reducers/cartReducer";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { IconButton, InputBase, Stack } from "@mui/material";
import { useEffect, useState } from "react";

const NumberStepperPreorder = ({
  product: { preOrder, id, data },
}: {
  product: CartProduct;
}) => {
  const quantity = preOrder?.quantity || 1;
  const [value, setValue] = useState<string | number>(quantity);
  const dispatch = useAppDispatch();
  const stockCount = data?.stock?.quantity || quantity;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setValue(e.target.value);

  const handleBlur = () => {
    let parseValue = Number(value);

    if (Number.isNaN(parseValue)) parseValue = quantity;
    if (parseValue > stockCount) parseValue = stockCount;
    if (parseValue < 1) parseValue = 1;

    setValue(parseValue);

    dispatch(setProductQuantity({ id: id, quantity: parseValue }));
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
          dispatch(
            setProductPreOrderQuantity({ id: id, quantity: quantity + 1 })
          )
        }
        className="stepper-btn"
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
          dispatch(
            setProductPreOrderQuantity({ id: id, quantity: quantity - 1 })
          )
        }
        className="stepper-btn"
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

export default NumberStepperPreorder;
