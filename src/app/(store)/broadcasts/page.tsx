"use client";
import { cancelBroadcast } from "@/actions/broadcast/cancelBroadcast";
import { deleteBroadcast } from "@/actions/broadcast/deleteBroadcast";
import fetchBroadcastDatatable, {
  BroadcastDatatableInstance,
} from "@/actions/broadcast/fetchBroadcastDatatable";
import { sendBroadcast } from "@/actions/broadcast/sendBroadcast";
import GridLinkAction from "@/components/GridLinkAction";
import { Path } from "@/config/Path";
import { Confirmation, useConfirm } from "@/hooks/use-confirm";
import useDatatable from "@/hooks/useDatatable";
import App, { Wrapper } from "@/layouts/App";
import { date } from "@/libs/formatter";
import {
  AddTwoTone,
  CancelTwoTone,
  DeleteTwoTone,
  EditTwoTone,
  NotificationsTwoTone,
  SendTwoTone,
  ViewAgendaTwoTone,
} from "@mui/icons-material";
import { Button, Chip, ChipProps } from "@mui/material";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { enqueueSnackbar } from "notistack";
import { useCallback } from "react";

const STATUS_CHIP_PROPS: Record<
  string,
  { label: string; color: ChipProps["color"] }
> = {
  DRAFT: { label: "ร่าง", color: "default" },
  SCHEDULED: { label: "รอส่ง", color: "info" },
  SENT: { label: "ส่งแล้ว", color: "success" },
  CANCELLED: { label: "ยกเลิก", color: "warning" },
  FAILED: { label: "ล้มเหลว", color: "error" },
};

const BroadcastPage = () => {
  const queryClient = useQueryClient();

  const cancelConfirmation = useConfirm({
    title: "ยืนยันการยกเลิก",
    text: "คุณต้องการยกเลิก Broadcast นี้หรือไม่?",
    confirmProps: {
      color: "warning",
      startIcon: <CancelTwoTone />,
    },
    onConfirm: async (id: number) => {
      try {
        await cancelBroadcast(id);
        cancelConfirmation.handleClose();
        await queryClient.refetchQueries({
          queryKey: ["datatable:broadcasts"],
          type: "active",
        });
        enqueueSnackbar("ยกเลิก Broadcast เรียบร้อยแล้ว!", {
          variant: "success",
        });
      } catch (error) {
        console.error("Error cancelling broadcast:", error);
        enqueueSnackbar("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้ง", {
          variant: "error",
        });
      }
    },
  });

  const deleteConfirmation = useConfirm({
    title: "ยืนยันการลบ",
    text: "คุณต้องการลบ Broadcast นี้หรือไม่?",
    confirmProps: {
      color: "error",
      startIcon: <DeleteTwoTone />,
    },
    onConfirm: async (id: number) => {
      try {
        await deleteBroadcast(id);
        deleteConfirmation.handleClose();
        await queryClient.refetchQueries({
          queryKey: ["datatable:broadcasts"],
          type: "active",
        });
        enqueueSnackbar("ลบ Broadcast เรียบร้อยแล้ว!", {
          variant: "success",
        });
      } catch (error) {
        console.error("Error deleting broadcast:", error);
        enqueueSnackbar("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้ง", {
          variant: "error",
        });
      }
    },
  });

  const sendConfirmation = useConfirm({
    title: "แจ้งเตือน",
    text: "คุณต้องการจะส่ง Broadcast นี้หรือไม่",
    confirmProps: {
      color: "warning",
      startIcon: <NotificationsTwoTone />,
    },
    onConfirm: async (id: number) => {
      try {
        await sendBroadcast(id);
        sendConfirmation.handleClose();
        await queryClient.refetchQueries({
          queryKey: ["datatable:broadcasts"],
          type: "active",
        });
        enqueueSnackbar("ส่งแจ้งเตือนประชาสัมพันธ์เรียบร้อยแล้ว!", {
          variant: "success",
        });
      } catch (error) {
        console.error("Error disabling promotion offer:", error);
        enqueueSnackbar("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้งภายหลัง", {
          variant: "error",
        });
      }
    },
  });

  const menu = {
    cancel: useCallback(
      (broadcast: BroadcastDatatableInstance) => () => {
        cancelConfirmation.with(broadcast.id);
        cancelConfirmation.handleOpen();
      },
      [cancelConfirmation]
    ),
    delete: useCallback(
      (broadcast: BroadcastDatatableInstance) => () => {
        deleteConfirmation.with(broadcast.id);
        deleteConfirmation.handleOpen();
      },
      [deleteConfirmation]
    ),
    sendBroadcast: useCallback(
      (broadcast: BroadcastDatatableInstance) => () => {
        sendConfirmation.with(broadcast.id);
        sendConfirmation.handleOpen();
      },
      [sendConfirmation]
    ),
  };

  const datatable = useDatatable<BroadcastDatatableInstance>({
    name: "broadcasts",
    fetch: fetchBroadcastDatatable,
    columns: [
      {
        field: "status",
        headerName: "สถานะ",
        width: 100,
        renderCell: ({ row }) => {
          const status =
            STATUS_CHIP_PROPS[row.status] || STATUS_CHIP_PROPS.DRAFT;
          return (
            <Chip label={status.label} color={status.color} size="small" />
          );
        },
      },
      {
        field: "title",
        headerName: "หัวข้อ",
        flex: 1,
      },
      {
        field: "note",
        headerName: "โปรโมชั่น",
        flex: 1,
        renderCell: ({ row }) => row.event.id,
      },
      {
        field: "scheduled_at",
        headerName: "ตั้งเวลาส่ง",
        flex: 1,
        renderCell: ({ row }) =>
          date(row.scheduled_at, {
            withTime: true,
            shortMonth: true,
            shortYear: true,
          }),
      },
      {
        field: "sent_at",
        headerName: "ส่งจริงเมื่อ",
        flex: 1,
        renderCell: ({ row }) =>
          row.sent_at
            ? date(row.sent_at, {
                withTime: true,
                shortMonth: true,
                shortYear: true,
              })
            : "-",
      },
      {
        field: "creator.user.name",
        headerName: "ผู้สร้าง",
        flex: 1,
        renderCell: ({ row }) => row.creator?.user.name || "ไม่ระบุ",
      },
      {
        field: "actions",
        type: "actions",
        headerName: "เครื่องมือ",
        flex: 0,
        getActions: ({ row }) => {
          const canEdit = ["DRAFT", "SCHEDULED"].includes(row.status);
          const canCancel = ["DRAFT", "SCHEDULED"].includes(row.status);
          const canDelete = ["DRAFT", "CANCELLED"].includes(row.status);
          const canSend = ["SCHEDULED"].includes(row.status);

          return [
            <GridLinkAction
              key="view"
              to={`${Path("broadcasts").href}/${row.id}`}
              icon={<ViewAgendaTwoTone />}
              label="ดูรายละเอียด"
              showInMenu
            />,
            <GridLinkAction
              key="edit"
              to={`${Path("broadcasts").href}/${row.id}/edit`}
              icon={<EditTwoTone />}
              label="แก้ไข"
              showInMenu
              disabled={!canEdit}
            />,
            <GridActionsCellItem
              key="cancel"
              icon={<CancelTwoTone />}
              label="ยกเลิก"
              onClick={menu.cancel(row)}
              showInMenu
              disabled={!canCancel}
            />,
            <GridActionsCellItem
              key="delete"
              icon={<DeleteTwoTone />}
              label="ลบ"
              onClick={menu.delete(row)}
              showInMenu
              disabled={!canDelete}
            />,
            <GridActionsCellItem
              key="send"
              icon={<SendTwoTone />}
              label="ส่ง"
              onClick={menu.sendBroadcast(row)}
              showInMenu
              disabled={!canSend}
            />,
          ];
        },
      },
    ],
  });

  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title>Broadcast ประชาสัมพันธ์</App.Header.Title>
        <App.Header.Actions>
          <Button
            component={Link}
            href={`${Path("broadcasts").href}/new`}
            startIcon={<AddTwoTone />}
            variant="contained"
            size="small"
          >
            สร้าง Broadcast
          </Button>
        </App.Header.Actions>
      </App.Header>
      <App.Main>{datatable}</App.Main>

      <Confirmation {...cancelConfirmation.props} />
      <Confirmation {...deleteConfirmation.props} />
      <Confirmation {...sendConfirmation.props} />
    </Wrapper>
  );
};

export default BroadcastPage;
