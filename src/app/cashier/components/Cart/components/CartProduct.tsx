import { useAppDispatch } from "@/hooks";
import { Confirmation, useConfirm } from "@/hooks/use-confirm";
import useDebouncedValue from "@/hooks/useDebouncedValue";
import { money } from "@/libs/formatter";
import {
  CartProduct as CartProductType,
  removeProductFromCart,
  setProductNote,
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
import { useEffect, useRef, useState } from "react";
import NumberStepper from "./NumberStepper";
import TextAction from "./TextAction";

const CartProduct = ({ product }: { product: CartProductType }) => {
  const [expand, setExpand] = useState(false);
  const [note, setNote] = useState("");
  const noteInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const debouncedNote = useDebouncedValue(note, 500);

  const confirmation = useConfirm({
    title: "แจ้งเตือน",
    text: "คุณต้องการที่จะลบสินค้าหรือไม่ ?",
    confirmProps: {
      startIcon: <DeleteTwoTone />,
      color: "error",
    },
    onConfirm: async () => dispatch(removeProductFromCart(product.id)),
  });

  const handleAddNote = () => {
    setExpand(true);
    setTimeout(() => noteInputRef.current?.focus(), 0);
  };

  const updateProductNote = () => {
    dispatch(setProductNote({ id: product.id, note: debouncedNote }));
  };

  useEffect(() => {
    updateProductNote();
  }, [debouncedNote, updateProductNote]);

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

              <TextAction label="หมายเหตุ" onClick={handleAddNote} />
              <TextAction label="จองสินค้านี้" />
            </Stack>
          </Stack>

          <Stack justifyContent={"center"}>
            <Typography
              variant="h6"
              fontWeight="bold"
              whiteSpace="nowrap"
              color="success.main"
              textAlign={"right"}
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
      <Collapse in={expand} timeout={0} unmountOnExit>
        <Stack direction={"row"}>
          <InputBase
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="ระบุหมายเหต..."
            inputRef={noteInputRef}
            sx={{
              width: "100%",
              fontSize: "0.75rem",
              borderBottom: "1px solid transparent",
              "&:focus-within": { borderBottomColor: "divider" },
            }}
            slotProps={{
              input: {
                maxLength: 40,
              },
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
