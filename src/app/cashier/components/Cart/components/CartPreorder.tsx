import { useAppDispatch } from "@/hooks";
import { Confirmation, useConfirm } from "@/hooks/use-confirm";
import { money } from "@/libs/formatter";
import {
  CartProduct as CartProductType,
  removePreorder,
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
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import NumberStepperPreorder from "./NumberStepperPreorder";

const CartPreorder = ({ product }: { product: CartProductType }) => {
  const [expand, setExpand] = useState(false);
  const [note, setNote] = useState(product.note ?? "");
  const dispatch = useAppDispatch();

  const confirmation = useConfirm({
    title: "แจ้งเตือน",
    text: "คุณต้องการที่จะลบสินค้าหรือไม่ ?",
    confirmProps: {
      startIcon: <DeleteTwoTone />,
      color: "error",
    },
    onConfirm: async () => dispatch(removePreorder(product.id)),
  });

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1,
        borderStyle: "dashed",
        backgroundColor: "var(--mui-palette-primary-50)",
        borderColor: "var(--mui-palette-primary-400)",
      }}
    >
      <Stack width={"100%"}>
        <Stack direction={"row"} spacing={1}>
          <NumberStepperPreorder product={product} />
          <Stack flex={1} minWidth={0} mr={1}>
            <Typography variant="h6" fontWeight="bold" noWrap sx={{ pr: 1 }}>
              {product.data?.label}
            </Typography>

            <Stack direction={"row"} spacing={1}>
              {product.data?.serial && (
                <Typography variant="caption" color="text.secondary" noWrap>
                  รหัสสินค้า {product.data.serial}
                </Typography>
              )}
            </Stack>
            <Typography
              variant="caption"
              fontWeight="bold"
              color="primary.main"
            >
              สินค้าพรีออเดอร์
            </Typography>
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

            <Stack direction={"row"} spacing={1} justifyContent={"end"}>
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
        <Stack spacing={1} mt={1}>
          <TextField
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onBlur={() => dispatch(setProductNote({ id: product.id, note }))}
            label="หมายเหตุ"
            variant="filled"
            sx={{
              width: "100%",
              fontSize: "0.75rem",
              borderBottom: "1px solid transparent",
              "&:focus-within": { borderBottomColor: "divider" },
            }}
            maxRows={2}
            multiline
          />
        </Stack>
      </Collapse>

      <Confirmation {...confirmation.props} />
    </Paper>
  );
};

export default CartPreorder;
