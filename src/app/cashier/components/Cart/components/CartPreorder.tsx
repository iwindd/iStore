import { useAppDispatch } from "@/hooks";
import { money } from "@/libs/formatter";
import {
  CartProduct as CartProductType,
  removePreOrderProductFromCart,
  setProductPreOrderNote,
} from "@/reducers/cartReducer";
import { Delete, ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  Collapse,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { useState } from "react";
import NumberStepperPreorder from "./NumberStepperPreorder";

const CartPreorder = ({ product }: { product: CartProductType }) => {
  const t = useTranslations("CASHIER.cart");
  const [expand, setExpand] = useState(false);
  const [note, setNote] = useState(product.note ?? "");
  const dispatch = useAppDispatch();

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
            <Typography variant="h6" noWrap sx={{ pr: 1 }}>
              {product.data?.label}
            </Typography>

            <Stack direction={"row"} spacing={1}>
              {product.data?.serial && (
                <Typography variant="caption" color="text.secondary" noWrap>
                  {t("product.serial")} {product.data.serial}
                </Typography>
              )}
            </Stack>
            <Typography
              variant="caption"
              fontWeight="bold"
              color="primary.main"
            >
              {t("product.preorder_status")}
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
                : t("product.free")}
            </Typography>

            <Stack direction={"row"} spacing={1} justifyContent={"end"}>
              <div>
                <IconButton
                  size="small"
                  onClick={() =>
                    dispatch(removePreOrderProductFromCart(product.id))
                  }
                >
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
            onBlur={() =>
              dispatch(setProductPreOrderNote({ id: product.id, note }))
            }
            label={t("product.note")}
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
    </Paper>
  );
};

export default CartPreorder;
