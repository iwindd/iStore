import { useAppDispatch } from "@/hooks";
import { preOrderProduct, setProductQuantity } from "@/reducers/cartReducer";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { useState } from "react";

const PreOrderDialog = ({
  open,
  handleClose,
  cartId,
  defaultValue,
}: {
  open: boolean;
  handleClose: () => void;
  cartId: string;
  defaultValue: number;
}) => {
  const t = useTranslations("CASHIER.cart.preorder_dialog");
  const [quantity, setQuantity] = useState("");
  const dispatch = useAppDispatch();

  const handleSubmit = () => {
    let realQuantity = Number(quantity);
    if (quantity == "") realQuantity = defaultValue;
    if (Number.isNaN(realQuantity)) realQuantity = defaultValue;

    dispatch(preOrderProduct({ cartId, quantity: realQuantity }));
    dispatch(
      setProductQuantity({ cartId, quantity: defaultValue - realQuantity }),
    );
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      disableRestoreFocus
    >
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label={t("title")}
          placeholder={defaultValue.toString()}
          fullWidth
          variant="standard"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t("cancel")}</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {t("confirm")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PreOrderDialog;
