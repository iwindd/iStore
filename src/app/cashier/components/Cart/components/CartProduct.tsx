import { useAppDispatch } from "@/hooks";
import { Confirmation, useConfirm } from "@/hooks/use-confirm";
import { money } from "@/libs/formatter";
import {
  CartProduct as CartProductType,
  removeProductFromCart,
} from "@/reducers/cartReducer";
import {
  Delete,
  DeleteTwoTone,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import {
  Collapse,
  FormControlLabel,
  IconButton,
  InputBase,
  Paper,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import NumberStepper from "./NumberStepper";
import TextAction from "./TextAction";

const CartProduct = ({ product }: { product: CartProductType }) => {
  const [expand, setExpand] = useState(false);
  const dispatch = useAppDispatch();

  const confirmation = useConfirm({
    title: "แจ้งเตือน",
    text: "คุณต้องการที่จะลบสินค้าหรือไม่ ?",
    confirmProps: {
      startIcon: <DeleteTwoTone />,
      color: "error",
    },
    onConfirm: async () => dispatch(removeProductFromCart(product.id)),
  });

  return (
    <Paper variant="outlined" sx={{ p: 1 }}>
      <Stack width={"100%"}>
        <Stack direction={"row"} spacing={1}>
          <NumberStepper product={product} />
          <Stack flex={1} minWidth={0} mr={1}>
            <Typography variant="h6" fontWeight="bold" noWrap sx={{ pr: 1 }}>
              {product.data?.label}
            </Typography>
            <Stack direction={"row"} spacing={1}>
              {product.data?.serial && (
                <Typography variant="caption" color="text.secondary" noWrap>
                  รหัสสินค้า
                  <Tooltip title={product.data.serial}>
                    <span> {product.data.serial.slice(0, 6)}...</span>
                  </Tooltip>
                </Typography>
              )}

              <TextAction label="หมายเหตุ" />
              <TextAction label="จองสินค้านี้" />
            </Stack>
          </Stack>

          <Stack justifyContent={"center"}>
            <Typography
              variant="h6"
              fontWeight="bold"
              whiteSpace="nowrap"
              color="success.main"
            >
              {(product.data?.price || 0) > 0
                ? money(product.data?.price || 0)
                : "ฟรี"}
            </Typography>

            <Stack direction={"row"} spacing={1}>
              <div>
                <IconButton size="small" onClick={confirmation.handleOpen}>
                  <Delete fontSize="small" />
                </IconButton>
              </div>
              <div>
                <IconButton
                  size="small"
                  onClick={() => setExpand((prev) => !prev)}
                >
                  {expand ? (
                    <ExpandLess fontSize="small" />
                  ) : (
                    <ExpandMore fontSize="small" />
                  )}
                </IconButton>
              </div>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      <Collapse in={expand} timeout="auto" unmountOnExit>
        <Stack direction={"row"}>
          <InputBase
            placeholder="ระบุหมายเหต..."
            sx={{
              width: "100%",
              fontSize: "0.75rem",
              borderBottom: "1px solid transparent",
              "&:focus-within": { borderBottomColor: "divider" },
            }}
          />
          <Stack
            flex={1}
            sx={{
              gap: 1,
              opacity: 0.5,
            }}
          >
            <FormControlLabel
              value="end"
              control={<Switch color="primary" />}
              label="จอง"
              labelPlacement="start"
            />
          </Stack>
        </Stack>
      </Collapse>

      <Confirmation {...confirmation.props} />
    </Paper>
  );
};

export default CartProduct;
