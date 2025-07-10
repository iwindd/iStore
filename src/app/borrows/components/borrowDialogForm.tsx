import CreateBorrow from "@/actions/borrow/create";
import Selector from "@/components/Selector";
import { useInterface } from "@/providers/InterfaceProvider";
import { BorrowsSchema, BorrowsValues } from "@/schema/Borrows";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddTwoTone } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import { Product } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { SubmitHandler, useForm } from "react-hook-form";

interface BorrowDialogFormDialogProps {
  onClose: () => void;
  open: boolean;
}

function BorrowDialogForm({
  open,
  onClose,
}: BorrowDialogFormDialogProps): React.JSX.Element {
  const { setBackdrop } = useInterface();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<BorrowsValues>({ 
    resolver: zodResolver(BorrowsSchema),
    defaultValues: {
      product: 0,
      count: null as any, // Use null to allow empty input
      note: "",
    }
  });
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const onSubmit: SubmitHandler<BorrowsValues> = async (
    payload: BorrowsValues
  ) => {
    try {
      setBackdrop(true);
      const resp = await CreateBorrow(payload);
      if (!resp.success) throw Error("error");
      onClose();
      reset();
      await queryClient.refetchQueries({
        queryKey: ["borrows"],
        type: "active",
      });
      enqueueSnackbar("บันทึกการเบิกสินค้าเรียบร้อยแล้ว!", {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้งภายหลัง", {
        variant: "error",
      });
    } finally {
      setBackdrop(false);
    }
  };

  const onSelect = (product: Product) => setValue("product", product ? product.id : 0);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit(onSubmit),
      }}
    >
      <DialogTitle>เบิกสินค้า</DialogTitle>
      <DialogContent>
        <Stack sx={{ mt: 1 }} spacing={1}>
          <Selector
            onSubmit={onSelect} 
            fieldProps={{
              error: errors["product"] !== undefined,
              helperText: errors["product"]?.message,
            }}
          />
          <TextField
            label="จำนวน"
            error={errors["count"] !== undefined}
            helperText={errors["count"]?.message}
            {...register("count", { valueAsNumber: true })}
          />
          <TextField
            label="หมายเหตุ"
            error={errors["note"] !== undefined}
            helperText={errors["note"]?.message}
            placeholder="เช่น ชื่อผู้ใช้ รหัสการสั่งจอง คำอธิบาย ข้อมูล คำชี้แจงเพิ่มเติม หรือ อื่นๆ"
            {...register("note")}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" type="button" onClick={onClose}>
          ปิด
        </Button>
        <Button color="success" variant="contained" startIcon={<AddTwoTone/>} type="submit">เบิกสินค้า</Button>
      </DialogActions>
    </Dialog>
  );
}

export default BorrowDialogForm;