import { useAppDispatch } from "@/hooks";
import { useDialog } from "@/hooks/use-dialog";
import { money } from "@/libs/formatter";
import {
  CartProduct as CartProductType,
  removeProductFromCart,
  setProductNote,
} from "@/reducers/cartReducer";
import { Delete, ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  CircularProgress,
  Collapse,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { useState } from "react";
import NumberStepper from "./NumberStepper";
import PreOrderDialog from "./PreOrderDialog";
import TextAction from "./TextAction";

const CartProduct = ({ product }: { product: CartProductType }) => {
  const t = useTranslations("CASHIER.cart");
  const [expand, setExpand] = useState(false);
  const [note, setNote] = useState(product.note ?? "");
  const preOrderDialog = useDialog();
  const dispatch = useAppDispatch();

  return (
    <Paper
      variant="outlined"
      elevation={2}
      sx={{
        p: 1,
        borderStyle: "dashed",
      }}
    >
      <Stack width={"100%"}>
        <Stack direction={"row"} spacing={1}>
          <NumberStepper product={product} />
          <Stack flex={1} minWidth={0} mr={1}>
            {product.data ? (
              // Has data - show normal display
              <>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="h6" noWrap sx={{ pr: 1 }}>
                    {product.data?.label}
                  </Typography>
                  {product.isLoading && (
                    <CircularProgress size={16} thickness={4} />
                  )}
                </Stack>

                <Stack direction={"row"} spacing={1}>
                  {product.data?.serial && (
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {t("product.serial")} {product.data.serial}
                    </Typography>
                  )}

                  {product.data.usePreorder && (
                    <TextAction
                      onClick={preOrderDialog.handleOpen}
                      label={t("product.preorder_label")}
                    />
                  )}
                </Stack>
              </>
            ) : (
              // No data yet - show full skeleton
              <>
                <Skeleton variant="text" width="80%" height={32} />
                <Stack direction={"row"} spacing={1}>
                  {product.serial && (
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {t("product.serial")} {product.serial}
                    </Typography>
                  )}
                  <Skeleton variant="text" width={60} height={20} />
                </Stack>
              </>
            )}
          </Stack>

          <Stack justifyContent={"center"}>
            {product.data ? (
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
            ) : (
              <Skeleton variant="text" width={80} height={32} />
            )}

            <Stack direction={"row"} spacing={1}>
              <div>
                <IconButton
                  size="small"
                  onClick={() =>
                    dispatch(removeProductFromCart(product.cartId))
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
              dispatch(setProductNote({ cartId: product.cartId, note }))
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

      <PreOrderDialog
        open={preOrderDialog.open}
        handleClose={preOrderDialog.handleClose}
        cartId={product.cartId}
        defaultValue={product.quantity}
      />
    </Paper>
  );
};

export default CartProduct;
