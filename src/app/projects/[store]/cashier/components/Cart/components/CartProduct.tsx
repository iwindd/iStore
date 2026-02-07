import GradientCircularProgress from "@/components/Loading/GradientCircularProgress";
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

  const productData = product.data ?? product._data;

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
            {productData ? (
              // Has data - show normal display
              <>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="h6" noWrap sx={{ pr: 1 }}>
                    {productData?.label}
                  </Typography>
                  {product.isLoading && (
                    <GradientCircularProgress size={16} thickness={4} />
                  )}
                </Stack>

                <Stack direction={"row"} spacing={1}>
                  {productData?.serial && (
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {t("product.serial")} {productData.serial}
                    </Typography>
                  )}

                  {productData.usePreorder && (
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
            {productData ? (
              <Typography
                variant="h6"
                fontWeight="bold"
                whiteSpace="nowrap"
                color="success.main"
                textAlign={"right"}
              >
                {(productData?.price || 0) > 0
                  ? money(productData?.price || 0)
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
