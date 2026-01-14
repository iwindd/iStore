import { useAppDispatch } from "@/hooks";
import { setProductPreOrderQuantity } from "@/reducers/cartReducer";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
} from "@mui/material";
import { useState } from "react";

const PreOrderDialog = ({
  open,
  handleClose,
  product_id,
  defaultValue,
}: {
  open: boolean;
  handleClose: () => void;
  product_id: number;
  defaultValue: number;
}) => {
  const [quantity, setQuantity] = useState("");
  const dispatch = useAppDispatch();

  const handleSubmit = () => {
    dispatch(
      setProductPreOrderQuantity({ id: product_id, quantity: Number(quantity) })
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
          label="จำนวนที่ต้องการพรีออเดอร์"
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
        <Button onClick={handleClose}>ยกเลิก</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          ยืนยัน
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PreOrderDialog;
