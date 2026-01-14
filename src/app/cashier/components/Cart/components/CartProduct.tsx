import { useAppDispatch } from "@/hooks";
import { Confirmation, useConfirm } from "@/hooks/use-confirm";
import { useDialog } from "@/hooks/use-dialog";
import { money } from "@/libs/formatter";
import {
  CartProduct as CartProductType,
  mergePreorder,
  removeProductFromCart,
  setPreOrderAll,
  setProductNote,
} from "@/reducers/cartReducer";
import {
  Delete,
  DeleteTwoTone,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Collapse,
  FormControlLabel,
  IconButton,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import CartPreorder from "./CartPreorder";
import NumberStepper from "./NumberStepper";
import PreOrderDialog from "./PreOrderDialog";
import TextAction from "./TextAction";

const CartProduct = ({ product }: { product: CartProductType }) => {
  const [expand, setExpand] = useState(false);
  const [note, setNote] = useState(product.note ?? "");
  const preOrderDialog = useDialog();
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

  const canPreOrder = product.data?.usePreorder;
  const isSplitPreOrder =
    !product.preOrder?.preOrderAll && (product.preOrder?.quantity || 0) > 0;

  return (
    <>
      <Paper
        variant="outlined"
        sx={{
          p: 1,
          borderStyle: "dashed",
          backgroundColor: product.preOrder?.preOrderAll
            ? "var(--mui-palette-primary-50)"
            : undefined,
          borderColor: product.preOrder?.preOrderAll
            ? "var(--mui-palette-primary-400)"
            : undefined,
        }}
      >
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
                    รหัสสินค้า {product.data.serial}
                  </Typography>
                )}

                {canPreOrder && !isSplitPreOrder && (
                  <TextAction
                    onClick={preOrderDialog.handleOpen}
                    label={
                      product.preOrder?.preOrderAll
                        ? "แยกพรีออเดอร์"
                        : "พรีออเดอร์"
                    }
                  />
                )}
              </Stack>
              {product.preOrder?.preOrderAll && (
                <Typography
                  variant="caption"
                  fontWeight="bold"
                  color="primary.main"
                >
                  สินค้าพรีออเดอร์
                </Typography>
              )}
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
            {canPreOrder &&
              (isSplitPreOrder ? (
                <Stack direction={"row-reverse"}>
                  <TextAction
                    onClick={() => {
                      dispatch(mergePreorder(product.id));
                    }}
                    label="รวมเป็นสินค้าพรีออเดอร์"
                  />
                </Stack>
              ) : (
                <Card
                  sx={{
                    boxShadow: 0,
                    border: "none",
                  }}
                >
                  <CardContent>
                    <FormControlLabel
                      value="end"
                      control={<Switch color="primary" />}
                      label="พรีออเดอร์"
                      checked={product.preOrder?.preOrderAll || false}
                      onChange={(_, checked) => {
                        dispatch(
                          setPreOrderAll({
                            id: product.id,
                            preOrderAll: checked,
                          })
                        );
                      }}
                    />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        พรีออเดอร์สินค้า ระบบจะไม่ตรวจสอบสต๊อก
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
          </Stack>
        </Collapse>

        <PreOrderDialog
          open={preOrderDialog.open}
          handleClose={preOrderDialog.handleClose}
          product_id={product.id}
          defaultValue={product.quantity}
        />
        <Confirmation {...confirmation.props} />
      </Paper>

      {isSplitPreOrder && <CartPreorder product={product} />}
    </>
  );
};

export default CartProduct;
