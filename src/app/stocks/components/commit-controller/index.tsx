"use client";
import React, { useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from "@mui/material";
import { useDialog } from "@/hooks/use-dialog";
import { SaveTwoTone } from "@mui/icons-material";
import { useInterface } from "@/providers/InterfaceProvider";
import { useStock } from "@/hooks/use-stock";
import { enqueueSnackbar } from "notistack";
import { number } from "@/libs/formatter";
import GetStock from "@/actions/stock/find";
import { useQueryClient } from "@tanstack/react-query";

interface CommitDialogProps {
  onClose: () => void;
  open: boolean;
}

const CommitDialog = ({
  open,
  onClose,
}: CommitDialogProps): React.JSX.Element => {
  const [type, setType] = React.useState<0 | 1>(0);
  const [note, setNote] = React.useState<string>("");
  const { isBackdrop, setBackdrop } = useInterface();
  const { commit, target, setStocks, setTarget } = useStock();
  const queryClient = useQueryClient();

  const handleChange = (event: SelectChangeEvent) => {
    setType(+event.target.value >= 1 ? 1 : 0);
  };

  const onSubmit = async () => {
    setBackdrop(true);
    try {
      const state = await commit(target ? true : type == 1, note);
      if (!state) throw Error("error");
      await queryClient.refetchQueries({
        queryKey: ["stocks_histories"],
        type: "active",
      });
      enqueueSnackbar("บันทึกรายการสต๊อกสำเร็จแล้ว!!", {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar("ไม่สามารถทำรายการได้ กรุณาลองอีกครั้งภายหลัง!", {
        variant: "error",
      });
    } finally {
      onClose();
      setBackdrop(false);
    }
  };

  const onClear = React.useCallback(() => {
    setStocks([]);
    setTarget(null);
    onClose();
  }, [setStocks, setTarget, onClose]);

  const fetchData = React.useCallback(() => {
    if (target) {
      setType(1);
      GetStock(target)
        .then((resp) => {
          if (resp.success && resp.data) {
            setNote(resp.data.note);
          } else {
            onClear();
          }
        })
        .catch((error) => {
          onClear();
        });
    }
  }, [target, onClear]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Dialog
      open={open && !isBackdrop}
      maxWidth="xs"
      onClose={onClose}
      fullWidth
      disableRestoreFocus
    >
      <DialogTitle>
        จัดการสต๊อก{target && `หมายเลข #${number(target)}`}
      </DialogTitle>
      <DialogContent>
        <Stack sx={{ mt: 2 }} spacing={1}>
          <Stack flexDirection={"column"} spacing={2}>
            <FormControl>
              <InputLabel id="selector-label">รูปแบบ</InputLabel>
              <Select
                labelId="selector-label"
                value={String(type)}
                label="รูปแบบ"
                onChange={handleChange}
                disabled={target != null}
              >
                <MenuItem value={0}>บันทึก</MenuItem>
                <MenuItem value={1}>จัดการทันที</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <TextField
            label="หมายเหตุ"
            value={note}
            placeholder="เช่น ชื่อผู้ใช้ รหัสการสั่งจอง คำอธิบาย ข้อมูล คำชี้แจงเพิ่มเติม หรือ อื่นๆ"
            onChange={(e) => setNote(e.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Stack sx={{ width: "100%" }} direction={"row"} justifyContent={"end"}>
          <Button color="secondary" onClick={onClose}>ปิด</Button>
          <Button color="success" variant="contained" startIcon={<SaveTwoTone/>} onClick={onSubmit}>ตกลง</Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

const CommitController = () => {
  const dialogInfo = useDialog();

  const onOpen = () => {
    dialogInfo.handleOpen();
  };

  const onClose = () => {
    dialogInfo.handleClose();
  };

  return (
    <>
      <Button
        color="inherit"
        endIcon={<SaveTwoTone />}
        onClick={onOpen}
        sx={{ ml: "auto" }}
      >
        จัดการสต๊อก
      </Button>

      <CommitDialog open={dialogInfo.open} onClose={onClose} />
    </>
  );
};

export default CommitController;
