"use client";
import React from "react";
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
import { useDialog } from "@/hooks/use-dialog";
import { PanToolAlt } from "@mui/icons-material";
import { ImportPayload, Imports, ImportType } from "../../import";
import MinStockController from "./components/MinStockController";
import { useInterface } from "@/providers/InterfaceProvider";
import ImportToolAction from "@/actions/stock/tool";
import { useStock } from "@/hooks/use-stock";
import { enqueueSnackbar } from "notistack";
import { useAuth } from "@/hooks/use-auth";
import { StockPermissionEnum } from "@/enums/permission";

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
  const [changedBy, setChangedBy] = React.useState<string>("10");
  const { isBackdrop, setBackdrop } = useInterface();
  const { stocks, setStocks } = useStock();

  const handleChange = (event: SelectChangeEvent) => {
    setType(+event.target.value);
    setPayload(null);
  };

  const onSubmit = async () => {
    if (!payload) return;
    if (+(changedBy || 0) <= 0) return;
    setBackdrop(true);

    try {
      const resp = await ImportToolAction(payload);
      if (!resp.success) throw Error(resp.message);

      setStocks(resp.data.map((p) => ({ ...p, payload: +changedBy })));
      enqueueSnackbar("เพิ่มสินค้าสำเร็จ!", { variant: "success" });
      onClose();
    } catch (error) {
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
            onChange={(e) => setChangedBy(e.target.value)}
            fullWidth
            label="เปลี่ยนแปลงโดย"
          />
          <Divider />
          {type == ImportType.FromMinStock && (
            <MinStockController payload={payload} setPayload={setPayload} />
          )}
          {stocks.length >= 50 && (
            <Alert color="error">การจัดการสต๊อกจำกัดสินค้าไว้ 50 รายการ</Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Stack sx={{ width: "100%" }} direction={"row"} justifyContent={"end"}>
          <Button color="secondary" onClick={onClose}>ปิด</Button>
          <Button color="success" variant="contained" startIcon={<PanToolAlt/>} disabled={stocks.length >= 50} onClick={onSubmit}>ยืนยัน</Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

const ToolController = () => {
  const dialogInfo = useDialog();
  const {user} = useAuth();
  const { target  } = useStock();

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
        disabled={target != null}
      >
        เครื่องมือ
      </Button>

      <SelecterDialog open={dialogInfo.open} onClose={onClose} />
    </>
  );
};

export default ToolController;
