"use client";
import { cancelBroadcast } from "@/actions/broadcast/cancelBroadcast";
import { deleteBroadcast } from "@/actions/broadcast/deleteBroadcast";
import fetchBroadcastDatatable, {
  BroadcastDatatableInstance,
} from "@/actions/broadcast/fetchBroadcastDatatable";
import { sendBroadcast } from "@/actions/broadcast/sendBroadcast";
import BroadcastStatusChip from "@/components/Chips/BroadcastStatusChip";
import GridLinkAction from "@/components/GridLinkAction";
import { Confirmation, useConfirm } from "@/hooks/use-confirm";
import useDatatable from "@/hooks/useDatatable";
import App, { Wrapper } from "@/layouts/App";
import { date } from "@/libs/formatter";
import { getPath } from "@/router";
import {
  AddTwoTone,
  CancelTwoTone,
  DeleteTwoTone,
  NotificationsTwoTone,
  SendTwoTone,
  ViewAgendaTwoTone,
} from "@mui/icons-material";
import { Button } from "@mui/material";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useCallback } from "react";

const BroadcastPage = () => {
  const t = useTranslations("BROADCASTS");
  const params = useParams<{ store: string }>();
  const queryClient = useQueryClient();

  const cancelConfirmation = useConfirm({
    title: t("datatable.confirmations.cancel.title"),
    text: t("datatable.confirmations.cancel.text"),
    confirmProps: {
      color: "warning",
      startIcon: <CancelTwoTone />,
    },
    onConfirm: async (id: number) => {
      try {
        await cancelBroadcast(params.store, id);
        cancelConfirmation.handleClose();
        await queryClient.refetchQueries({
          queryKey: ["broadcasts"],
          type: "active",
        });
        enqueueSnackbar(t("datatable.confirmations.cancel.success"), {
          variant: "success",
        });
      } catch (error) {
        console.error("Error cancelling broadcast:", error);
        enqueueSnackbar(t("datatable.confirmations.cancel.error"), {
          variant: "error",
        });
      }
    },
  });

  const deleteConfirmation = useConfirm({
    title: t("datatable.confirmations.delete.title"),
    text: t("datatable.confirmations.delete.text"),
    confirmProps: {
      color: "error",
      startIcon: <DeleteTwoTone />,
    },
    onConfirm: async (id: number) => {
      try {
        await deleteBroadcast(params.store, id);
        deleteConfirmation.handleClose();
        await queryClient.refetchQueries({
          queryKey: ["broadcasts"],
          type: "active",
        });
        enqueueSnackbar(t("datatable.confirmations.delete.success"), {
          variant: "success",
        });
      } catch (error) {
        console.error("Error deleting broadcast:", error);
        enqueueSnackbar(t("datatable.confirmations.delete.error"), {
          variant: "error",
        });
      }
    },
  });

  const sendConfirmation = useConfirm({
    title: t("datatable.confirmations.send.title"),
    text: t("datatable.confirmations.send.text"),
    confirmProps: {
      color: "warning",
      startIcon: <NotificationsTwoTone />,
    },
    onConfirm: async (id: number) => {
      try {
        await sendBroadcast(params.store, id);
        sendConfirmation.handleClose();
        await queryClient.refetchQueries({
          queryKey: ["broadcasts"],
          type: "active",
        });
        enqueueSnackbar(t("datatable.confirmations.send.success"), {
          variant: "success",
        });
      } catch (error) {
        console.error("Error disabling promotion offer:", error);
        enqueueSnackbar(t("datatable.confirmations.send.error"), {
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
      [cancelConfirmation],
    ),
    delete: useCallback(
      (broadcast: BroadcastDatatableInstance) => () => {
        deleteConfirmation.with(broadcast.id);
        deleteConfirmation.handleOpen();
      },
      [deleteConfirmation],
    ),
    sendBroadcast: useCallback(
      (broadcast: BroadcastDatatableInstance) => () => {
        sendConfirmation.with(broadcast.id);
        sendConfirmation.handleOpen();
      },
      [sendConfirmation],
    ),
  };

  const datatable = useDatatable<BroadcastDatatableInstance>({
    name: "broadcasts",
    fetch: fetchBroadcastDatatable,
    columns: [
      {
        field: "status",
        headerName: t("datatable.headers.status"),
        width: 120,
        renderCell: ({ row }) => <BroadcastStatusChip status={row.status} />,
      },
      {
        field: "title",
        headerName: t("datatable.headers.title"),
        flex: 1,
      },
      {
        field: "note",
        headerName: t("datatable.headers.promotion"),
        flex: 1,
        renderCell: ({ row }) =>
          row.event.note || t("datatable.placeholders.not_specified"),
      },
      {
        field: "scheduled_at",
        headerName: t("datatable.headers.scheduled_at"),
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
        headerName: t("datatable.headers.sent_at"),
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
        headerName: t("datatable.headers.creator"),
        flex: 1,
        renderCell: ({ row }) =>
          row.creator?.user.name || t("datatable.placeholders.not_specified"),
      },
      {
        field: "actions",
        type: "actions",
        headerName: t("datatable.headers.actions"),
        flex: 0,
        getActions: ({ row }) => {
          const canCancel = ["DRAFT", "SCHEDULED"].includes(row.status);
          const canDelete = ["DRAFT", "CANCELLED"].includes(row.status);
          const canSend = ["SCHEDULED"].includes(row.status);

          return [
            <GridLinkAction
              key="view"
              to={`${getPath("projects.store.broadcasts.broadcast", { id: row.id.toString() })}`}
              icon={<ViewAgendaTwoTone />}
              label={t("datatable.actions.view")}
              showInMenu
            />,
            <GridActionsCellItem
              key="cancel"
              icon={<CancelTwoTone />}
              label={t("datatable.actions.cancel")}
              onClick={menu.cancel(row)}
              showInMenu
              disabled={!canCancel}
            />,
            <GridActionsCellItem
              key="delete"
              icon={<DeleteTwoTone />}
              label={t("datatable.actions.delete")}
              onClick={menu.delete(row)}
              showInMenu
              disabled={!canDelete}
            />,
            <GridActionsCellItem
              key="send"
              icon={<SendTwoTone />}
              label={t("datatable.actions.send")}
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
        <App.Header.Title>{t("title")}</App.Header.Title>
        <App.Header.Actions>
          <Button
            component={Link}
            href={getPath("projects.store.broadcasts.create")}
            startIcon={<AddTwoTone />}
            variant="contained"
            color="secondary"
            size="small"
          >
            {t("create_button")}
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
