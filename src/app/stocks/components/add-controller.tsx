"use client";
import React from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { AddTwoTone, SaveTwoTone } from "@mui/icons-material";
import { useDialog } from "@/hooks/use-dialog";
import { useInterface } from "@/providers/InterfaceProvider";
import Selector from "@/components/Selector";
import { useStock } from "@/hooks/use-stock";
import { Product } from "@prisma/client";
import { useAuth } from "@/hooks/use-auth";
import { StockPermissionEnum } from "@/enums/permission";

interface StockDialogProps {
  onClose: () => void;
  open: boolean;
}

function StockFormDialog({
  open,
  onClose,
}: StockDialogProps): React.JSX.Element {
  const { stocks, addProduct } = useStock();
  const [product, setProduct] = React.useState<Product | null>(null);
  const [changedBy, setChangedBy] = React.useState<string | number>();

  const reset = () => {
    setProduct(null);
    setChangedBy(0);
  };

  const Close = () => {
    reset();
    onClose();
  };

  const onSubmit = (newProduct: Product) => {
    if (!newProduct) return setProduct(null);
    const stock = stocks.find((product) => product.id == newProduct.id);
    if (stock) setChangedBy(stock.payload);
    setProduct(newProduct);
  };

  const onConfirm = () => {
    if (!product) return;
    if (!changedBy) return;
    if (isNaN(+changedBy) || +changedBy == 0) return;
    addProduct(product, +changedBy);
    setChangedBy("");
    Close();
  };

  return (
    <Dialog open={open} maxWidth="xs" onClose={Close} fullWidth disableRestoreFocus>
      <DialogTitle>
        เพิ่มรายการ
      </DialogTitle>
      <DialogContent>
        <Stack sx={{ mt: 2 }}>
          <Stack flexDirection={"column"} spacing={1}>
            <Selector onSubmit={onSubmit} />
            <TextField
              type="number"
              value={changedBy}
              onChange={(e) => setChangedBy(e.target.value)}
              fullWidth
              label="จำนวน"
            />
            {
              stocks.length >= 50 && (
                <Alert color="error">การจัดการสต๊อกจำกัดสินค้าไว้ 50 รายการ</Alert>
              )
            }
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Stack sx={{ width: "100%" }} direction={"row"} justifyContent={"end"}>
          <Button color="secondary" onClick={Close}>ปิด</Button>
          <Button variant="contained" color="success" startIcon={<SaveTwoTone/>}  disabled={stocks.length >= 50} onClick={onConfirm}>บันทึก</Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

const AddController = () => {
  const dialog = useDialog();
  const { isBackdrop } = useInterface();
  const {user} = useAuth();
  const { target  } = useStock();

  if (!user?.hasPermission(StockPermissionEnum.CREATE)) return null;

  return (
    <>
      <Button
        startIcon={<AddTwoTone />}
        variant="contained"
        onClick={dialog.handleOpen}
        disabled={target != null || isBackdrop}
      >
        เพิ่มรายการ
      </Button>

      <StockFormDialog
        open={dialog.open && !isBackdrop}
        onClose={dialog.handleClose}
      />
    </>
  );
};

export default AddController;
