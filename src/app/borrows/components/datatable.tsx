"use client";
import React, { useEffect } from "react";
import Datatable from "@/components/Datatable";
import { CancelTwoTone, EditTwoTone, SaveTwoTone } from "@mui/icons-material";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { Borrows } from "@prisma/client";
import GetBorrows from "@/actions/borrow/get";
import { enqueueSnackbar } from "notistack";
import { Confirmation, useConfirm } from "@/hooks/use-confirm";
import { useQueryClient } from "@tanstack/react-query";
import CancelBorrow from "@/actions/borrow/cancel";
import * as ff from '@/libs/formatter';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import UpdateBorrow from "@/actions/borrow/update";
import { useDialog } from "@/hooks/use-dialog";
import { useInterface } from "@/providers/InterfaceProvider";
import { useAuth } from "@/hooks/use-auth";
import { BorrowPermissionEnum } from "@/enums/permission";

interface BorrowUpdateProps {
  onClose: () => void;
  open: boolean;
  borrow: Borrows | null;
}

const formatCellColor = (status : Borrows['status']) => {
  switch (status) {
    case "PROGRESS": 
      return "warning"
    case "SUCCESS":
      return "success"
    case "CANCEL":
      return "secondary"
    default:
      return "secondary"
  }
}

const BorrowUpdateDialog = ({ open, onClose, borrow }: BorrowUpdateProps) => {
  const productLeft = borrow ? borrow.amount - borrow.count : 0;
  const borrowId = borrow ? borrow.id : 0;
  const [count, setCount] = React.useState<number>(productLeft);
  const {setBackdrop} = useInterface();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (borrow) setCount(borrow?.amount-borrow?.count)
  }, [borrow])

  const onSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBackdrop(true);
    try {
      const resp = await UpdateBorrow(borrowId, count);
      if (!resp.success) throw Error(resp.message);
      onClose();
      enqueueSnackbar("ยกเลิกรายการเบิกสำเร็จแล้ว!", { variant: "success" });
      await queryClient.refetchQueries({
        queryKey: ["borrows"],
        type: "active",
      });
    } catch (error) {
      enqueueSnackbar("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้งภายหลัง");
    } finally {
      setBackdrop(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        component: "form",
        onSubmit: onSubmit,
      }}
    >
      <DialogTitle>อัพเดทรายการเบิก</DialogTitle>
      <DialogContent>
        <Stack sx={{ mt: 2 }}>
          <TextField
            type="number"
            label="จำนวนที่ขายได้"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            fullWidth
            InputProps={{ inputProps: { min: 1, max: productLeft } }}
            required
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" type="button" onClick={onClose}>
          ปิด
        </Button>
        <Button variant="contained" color="success" startIcon={<SaveTwoTone/>} type="submit">อัพเดท</Button>
      </DialogActions>
    </Dialog>
  );
};

const BorrowDatatable = () => {
  const queryClient = useQueryClient();
  const updateDialog = useDialog();
  const {isBackdrop} = useInterface();
  const [borrow, setBorrow] = React.useState<Borrows | null>(null);
  const {user} = useAuth();
  const permissions = (borrow : Borrows) => ({
    canCancelBorrow: user?.hasPermission(BorrowPermissionEnum.DELETE) || borrow.user_store_id == user?.userStoreId,
    canUpdateBorrow: user?.hasPermission(BorrowPermissionEnum.UPDATE) || borrow.user_store_id == user?.userStoreId,
  })

  const confirmation = useConfirm({
    title: "แจ้งเตือน",
    text: "คุณต้องการจะยกเลิกรายการเบิกหรือไม่?",
    confirmProps: {
      color: "error",
      startIcon: <CancelTwoTone />,
    },
    onConfirm: async (id: number) => {
      try {
        const resp = await CancelBorrow(id, "CANCEL");

        if (!resp.success) throw Error(resp.message);
        enqueueSnackbar("ยกเลิกรายการเบิกสำเร็จแล้ว!", { variant: "success" });
        await queryClient.refetchQueries({
          queryKey: ["borrows"],
          type: "active",
        });
      } catch (error) {
        enqueueSnackbar("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้งภายหลัง");
      }
    },
  });

  const menu = {
    edit: React.useCallback(
      (row: Borrows) => () => {
        setBorrow(row);
        updateDialog.handleOpen();
      },
      [setBorrow, updateDialog]
    ),
    cancel: React.useCallback(
      (row: Borrows) => () => {
        confirmation.with(row.id);
        confirmation.handleOpen();
      },
      [confirmation]
    ),
  };

  const columns = (): GridColDef[] => {
    return [
      {
        field: "created_at",
        sortable: true,
        headerName: "วันที่เบิก",
        flex: 3,
        editable: false,
        renderCell: ({value}) => ff.date(value)
      },
      {
        field: "user_store",
        sortable: true,
        headerName: "ผู้เบิก",
        flex: 2,
        editable: false,
        renderCell: (data) => ff.text(data?.value?.user?.name || "ไม่ระบุ")
      },
      {
        field: "product",
        sortable: true,
        headerName: "สินค้า",
        flex: 3,
        editable: false,
        renderCell: ({row}) => row.product.label
      },
      {
        field: "note",
        sortable: true,
        headerName: "หมายเหตุ",
        flex: 3,
        editable: false,
        renderCell: ({value}) => ff.text(value)
      },
      {
        field: "status",
        sortable: false,
        headerName: "สถานะ",
        flex: 2,
        editable: false,
        renderCell: ({value}) => ff.borrowStatus(value)
      },
      {
        field: "amount",
        sortable: true,
        headerName: "จำนวนที่เบิก",
        flex: 2,
        editable: false,
        renderCell: ({row} : {row : Borrows}) => `${ff.number(row.amount)} รายการ`
      },
      {
        field: "count",
        sortable: true,
        headerName: "จำนวนที่ขายได้",
        flex: 2,
        editable: false,
        renderCell: ({row} : {row : Borrows}) => `${ff.number(row.count)} รายการ`
      },
      {
        field: "actions",
        type: "actions",
        headerName: "เครื่องมือ",
        flex: 1,
        getActions: ({ row }: { row: Borrows }) => [
          ...(row.status == "PROGRESS"
            ? [
                <GridActionsCellItem
                  key="edit"
                  icon={<EditTwoTone />}
                  onClick={menu.edit(row)}
                  label="อัพเดท"
                  sx={{ display: !permissions(row).canUpdateBorrow ? "none" : undefined}}
                  showInMenu
                />,
                <GridActionsCellItem
                  key="cancel"
                  icon={<CancelTwoTone />}
                  onClick={menu.cancel(row)}
                  label="ยกเลิก"
                  sx={{ display: !permissions(row).canCancelBorrow ? "none" : undefined}}
                  showInMenu
                />,
              ]
            : []),
        ],
      },
    ];
  };

  return (
    <>
      <Datatable
        name={"borrows"}
        columns={columns()}
        fetch={GetBorrows}
        height={700}
        getCellClassName={(params) => params.field == 'status' ? `text-color-${formatCellColor(params.value as Borrows["status"])}` : ""}
      />

      <Confirmation {...confirmation.props} />
      <BorrowUpdateDialog
        open={updateDialog.open && !isBackdrop}
        onClose={updateDialog.handleClose}
        borrow={borrow}
      />
    </>
  );
};

export default BorrowDatatable;
