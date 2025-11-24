"use client";
import { StockPermissionEnum } from "@/enums/permission";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useAuth } from "@/hooks/use-auth";
import { useDialog } from "@/hooks/use-dialog";
import { number } from "@/libs/formatter";
import { useInterface } from "@/providers/InterfaceProvider";
import { commitStock, resetStock } from "@/reducers/stockReducer";
import { SaveTwoTone } from "@mui/icons-material";
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
import { useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import React from "react";

interface CommitDialogProps {
  onClose: () => void;
  open: boolean;
}

enum CommitActionType {
  COMMIT = 1,
  SAVE = 0,
}

const CommitDialog = ({
  open,
  onClose,
}: CommitDialogProps): React.JSX.Element => {
  const [actionType, setActionType] = React.useState<CommitActionType>(
    CommitActionType.SAVE
  );
  const [note, setNote] = React.useState<string>("");
  const { isBackdrop, setBackdrop } = useInterface();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const currentStockId = useAppSelector((state) => state.stock.id);

  const handleChange = (event: SelectChangeEvent<CommitActionType>) => {
    const {
      target: { value },
    } = event;
    setActionType(value);
  };

  const onSubmit = async () => {
    setBackdrop(true);
    try {
      dispatch(
        commitStock({
          note: note,
          updateStock: actionType == CommitActionType.COMMIT,
        })
      );
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
    dispatch(resetStock());
    onClose();
  }, [onClose]);

  /*   const fetchData = React.useCallback(() => {
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
 */
  return (
    <Dialog
      open={open && !isBackdrop}
      maxWidth="xs"
      onClose={onClose}
      fullWidth
      disableRestoreFocus
    >
      <DialogTitle>
        จัดการสต๊อก{currentStockId && `หมายเลข #${number(currentStockId)}`}
      </DialogTitle>
      <DialogContent>
        <Stack sx={{ mt: 2 }} spacing={1}>
          <Stack flexDirection={"column"} spacing={2}>
            <FormControl>
              <InputLabel id="selector-label">รูปแบบ</InputLabel>
              <Select
                labelId="selector-label"
                value={actionType}
                label="รูปแบบ"
                onChange={handleChange}
              >
                <MenuItem value={CommitActionType.SAVE}>บันทึก</MenuItem>
                <MenuItem
                  value={CommitActionType.COMMIT}
                  disabled={!user?.hasPermission(StockPermissionEnum.UPDATE)}
                >
                  จัดการทันที
                </MenuItem>
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
          <Button color="secondary" onClick={onClose}>
            ปิด
          </Button>
          <Button
            color="success"
            variant="contained"
            startIcon={<SaveTwoTone />}
            onClick={onSubmit}
          >
            ตกลง
          </Button>
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
        color="warning"
        endIcon={<SaveTwoTone />}
        onClick={onOpen}
        sx={{ ml: "auto" }}
        variant="contained"
      >
        จัดการสต๊อก
      </Button>

      <CommitDialog open={dialogInfo.open} onClose={onClose} />
    </>
  );
};

export default CommitController;
