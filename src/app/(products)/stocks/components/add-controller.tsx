"use client";
import AddProductDialog from "@/components/Forms/Promotions/FormBuyXGetY/components/AddProductDialog";
import { StockPermissionEnum } from "@/enums/permission";
import { useAppDispatch } from "@/hooks";
import { useAuth } from "@/hooks/use-auth";
import { useDialog } from "@/hooks/use-dialog";
import { useInterface } from "@/providers/InterfaceProvider";
import { setProductToStockById } from "@/reducers/stockReducer";
import { AddProductDialogValues } from "@/schema/Promotion/AddProductToOffer";
import { AddTwoTone } from "@mui/icons-material";
import { Button } from "@mui/material";

const AddController = () => {
  const dialog = useDialog();
  const { isBackdrop } = useInterface();
  const { user } = useAuth();
  const dispatch = useAppDispatch();

  const onSubmit = (payload: AddProductDialogValues) => {
    dispatch(
      setProductToStockById({
        product_id: payload.product_id,
        quantity: payload.quantity,
      })
    );
    dialog.handleClose();
  };

  if (!user?.hasPermission(StockPermissionEnum.CREATE)) return null;

  return (
    <>
      <Button
        startIcon={<AddTwoTone />}
        variant="contained"
        onClick={dialog.handleOpen}
        size="small"
      >
        เพิ่มรายการ
      </Button>

      <AddProductDialog
        title="เพิ่มรายการสินค้า"
        open={dialog.open && !isBackdrop}
        onClose={dialog.handleClose}
        onSubmit={onSubmit}
      />
    </>
  );
};

export default AddController;
