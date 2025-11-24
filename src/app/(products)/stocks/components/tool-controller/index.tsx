"use client";
import ImportToolAction from "@/actions/stock/tool";
import STOCK_CONFIG from "@/config/Stock";
import { StockPermissionEnum } from "@/enums/permission";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useAuth } from "@/hooks/use-auth";
import { useDialog } from "@/hooks/use-dialog";
import { number } from "@/libs/formatter";
import { useInterface } from "@/providers/InterfaceProvider";
import { setStockProducts } from "@/reducers/stockReducer";
import { PanToolAlt } from "@mui/icons-material";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import React from "react";
import {
  ImportFromMinStockPayload,
  ImportPayload,
  Imports,
  ImportType,
} from "../../import";
import MinStockController from "./components/MinStockController";

interface SelecterDialogProps {
  onClose: () => void;
  open: boolean;
}

const SelecterDialog = ({
  open,
  onClose,
}: SelecterDialogProps): React.JSX.Element => {
  const [type, setType] = React.useState<ImportType>(ImportType.FromMinStock);
  const [payload, setPayload] = React.useState<ImportPayload | null>(null);
  const [changedBy, setChangedBy] = React.useState<number>(10);
  const { isBackdrop, setBackdrop } = useInterface();
  const dispatch = useAppDispatch();
  const stockProducts = useAppSelector((state) => state.stock.products);

  const handleChange = (event: SelectChangeEvent) => {
    setType(+event.target.value);
    setPayload(null);
  };

  const onSubmit = async () => {
    if (!payload) return;
    if (+(changedBy || 0) <= 0) return;
    setBackdrop(true);

    try {
      const resp = await ImportToolAction({
        ...payload,
        changedBy,
      } as ImportFromMinStockPayload);
      dispatch(setStockProducts(resp));
      enqueueSnackbar("เพิ่มสินค้าสำเร็จ!", { variant: "success" });
      onClose();
    } catch (error) {
      console.error(error);
      enqueueSnackbar("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้งภายหลัง", {
        variant: "error",
      });
    } finally {
      setBackdrop(false);
    }
  };

  return (
    <Dialog
      open={open && !isBackdrop}
      maxWidth="xs"
      onClose={onClose}
      fullWidth
      disableRestoreFocus
    >
      <DialogTitle>เครื่องมือ</DialogTitle>
      <DialogContent>
        <Stack sx={{ mt: 2 }} spacing={1}>
          <Stack flexDirection={"column"} spacing={1}>
            <FormControl>
              <InputLabel id="selector-label">ประเภทการนำเข้า</InputLabel>
              <Select
                labelId="selector-label"
                value={String(type)}
                label="ประเภทการนำเข้า"
                onChange={handleChange}
              >
                {Imports.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          <TextField
            type="number"
            value={changedBy}
            onChange={(e) => setChangedBy(+e.target.value)}
            fullWidth
            label="เปลี่ยนแปลงโดย"
          />
          <Divider />
          {type == ImportType.FromMinStock && (
            <MinStockController payload={payload} setPayload={setPayload} />
          )}
          {stockProducts.length >= STOCK_CONFIG.MAX_STOCK_PRODUCT_PER_STOCK && (
            <Alert color="error">
              การจัดการสต๊อกจำกัดสินค้าไว้{" "}
              {number(STOCK_CONFIG.MAX_STOCK_PRODUCT_PER_STOCK)} รายการ
            </Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Stack sx={{ width: "100%" }} direction={"row"} justifyContent={"end"}>
          <Button color="secondary" onClick={onClose}>
            ปิด
          </Button>
          <Button
            color="success"
            variant="contained"
            startIcon={<PanToolAlt />}
            disabled={
              stockProducts.length >= STOCK_CONFIG.MAX_STOCK_PRODUCT_PER_STOCK
            }
            onClick={onSubmit}
          >
            ยืนยัน
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

const ToolController = () => {
  const dialogInfo = useDialog();
  const { user } = useAuth();

  const onOpen = () => {
    dialogInfo.handleOpen();
  };

  const onClose = () => {
    dialogInfo.handleClose();
  };

  if (!user?.hasPermission(StockPermissionEnum.CREATE)) return null;

  return (
    <>
      <Button
        startIcon={<PanToolAlt />}
        variant="text"
        color="secondary"
        onClick={onOpen}
        size="small"
      >
        เครื่องมือ
      </Button>

      <SelecterDialog open={dialogInfo.open} onClose={onClose} />
    </>
  );
};

export default ToolController;
