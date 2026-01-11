"use client";
import ImportToolAction from "@/actions/stock/tool";
import { useInterface } from "@/providers/InterfaceProvider";
import { StockValues } from "@/schema/Stock";
import { PanToolAlt } from "@mui/icons-material";
import {
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
import { UseFormReturn } from "react-hook-form";
import MinStockController from "./components/MinStockController";
import {
  ImportFromMinStockPayload,
  ImportPayload,
  Imports,
  ImportType,
} from "./type";

interface ToolDialogProps {
  onClose: () => void;
  open: boolean;
  form: UseFormReturn<StockValues>;
}

const ToolDialog = ({
  open,
  onClose,
  form,
}: ToolDialogProps): React.JSX.Element => {
  const [type, setType] = React.useState<ImportType>(ImportType.FromMinStock);
  const [payload, setPayload] = React.useState<ImportPayload | null>(null);
  const [changedBy, setChangedBy] = React.useState<number>(10);
  const { isBackdrop, setBackdrop } = useInterface();

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
      form.setValue("products", resp);
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
            onClick={onSubmit}
          >
            ยืนยัน
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default ToolDialog;
