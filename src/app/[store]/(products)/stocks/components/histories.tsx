"use client";
import CancelStock from "@/actions/stock/cancel";
import getExportStockData from "@/actions/stock/getExportStockReceiptData";
import getStockReceiptDatatable, {
  StockReceiptDatatableInstance,
} from "@/actions/stock/getStockReceiptDatatable";
import StockReceiptStatusChip from "@/components/Chips/StockReceiptStatusChip";
import Datatable from "@/components/Datatable";
import GridLinkAction from "@/components/GridLinkAction";
import { StockPermissionEnum } from "@/enums/permission";
import { useAuth } from "@/hooks/use-auth";
import { Confirmation, useConfirm } from "@/hooks/use-confirm";
import { useExport } from "@/hooks/use-export";
import * as ff from "@/libs/formatter";
import { useInterface } from "@/providers/InterfaceProvider";
import { getPath } from "@/router";
import {
  CancelTwoTone,
  DownloadTwoTone,
  ViewAgendaTwoTone,
} from "@mui/icons-material";
import { Box, Tab, Tabs } from "@mui/material";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { StockReceiptStatus } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useSnackbar } from "notistack";
import React, { useState } from "react";

const HistoryDatatable = () => {
  const t = useTranslations("STOCKS.datatable");
  const ts = useTranslations("STOCKS.status");
  const { setBackdrop } = useInterface();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const [filterType, setFilterType] = useState<
    "all" | "completed" | "draft" | "cancelled"
  >("all");

  const permissions = (stock: StockReceiptDatatableInstance) => ({
    canCancelStock:
      user?.hasPermission(StockPermissionEnum.DELETE) ||
      stock.creator?.id === user?.userStoreId,
    canCreateStock: user?.hasPermission(StockPermissionEnum.CREATE),
  });

  const { setItems, Export, ExportHandler } = useExport([
    { label: t("export_labels.serial"), key: "serial" },
    { label: t("export_labels.label"), key: "label" },
    { label: t("export_labels.price"), key: "price" },
    { label: t("export_labels.cost"), key: "cost" },
    { label: t("export_labels.delta"), key: "delta" },
    { label: t("export_labels.keywords"), key: "keywords" },
  ]);

  const cancelConfirmation = useConfirm({
    title: t("confirmation.cancel_title"),
    text: t("confirmation.cancel_text"),
    onConfirm: async (id: number) => {
      try {
        const resp = await CancelStock(id);

        if (!resp.success) throw new Error(resp.message);
        enqueueSnackbar(
          t("confirmation.cancel_success", { id: ff.number(id) }),
          {
            variant: "success",
          },
        );
        await queryClient.refetchQueries({
          queryKey: ["stocks_histories"],
          type: "active",
        });
      } catch (error) {
        console.error(error);
        enqueueSnackbar(t("confirmation.error"), {
          variant: "error",
        });
      }
    },
  });

  const onExport = React.useCallback(
    async (stockId: number) => {
      try {
        setBackdrop(true);
        const stockData = await getExportStockData(stockId);
        if (!stockData) throw new Error("error");

        setItems(
          stockData.map((item) => ({
            serial: item.product.serial,
            label: item.product.label,
            price: item.product.price,
            cost: item.product.cost,
            delta: item.quantity,
            keywords: item.product.keywords,
          })),
        );
        Export();
      } catch (error) {
        console.error(error);
        enqueueSnackbar(t("confirmation.error"), {
          variant: "error",
        });
      } finally {
        setBackdrop(false);
      }
    },
    [setBackdrop, setItems, Export, t, enqueueSnackbar],
  );

  const menu = {
    cancel: React.useCallback(
      (row: StockReceiptDatatableInstance) => () => {
        cancelConfirmation.with(row.id);
        cancelConfirmation.handleOpen();
      },
      [cancelConfirmation],
    ),
    export: React.useCallback(
      (row: StockReceiptDatatableInstance) => () => {
        onExport(row.id);
      },
      [onExport],
    ),
  };

  const columns = (): GridColDef<StockReceiptDatatableInstance>[] => {
    return [
      {
        field: "action_at",
        sortable: true,
        headerName: t("headers.date"),
        flex: 2,
        editable: false,
        renderCell: ({ row }) => ff.date(row.action_at),
      },
      {
        field: "creator",
        sortable: true,
        headerName: t("headers.creator"),
        flex: 2,
        renderCell: ({ row }) =>
          ff.text(row.creator?.user.name || t("placeholders.not_specified")),
      },
      {
        field: "_count",
        sortable: false,
        headerName: t("headers.count"),
        flex: 2,
        editable: false,
        renderCell: ({ row }) =>
          t("units.items", {
            count: ff.number(row._count.stock_recept_products),
          }),
      },
      {
        field: "total_quantity",
        sortable: false,
        headerName: t("headers.total_quantity"),
        flex: 2,
        editable: false,
        renderCell: ({ row }) =>
          ff.number(
            row.stock_recept_products.reduce((a, b) => a + b.quantity, 0),
          ),
      },
      {
        field: "note",
        sortable: true,
        headerName: t("headers.note"),
        flex: 3,
        editable: false,
        renderCell: ({ row }) =>
          ff.text(row.note || t("placeholders.not_specified")),
      },
      {
        field: "status",
        sortable: true,
        headerName: t("headers.status"),
        flex: 2,
        editable: false,
        renderCell: ({ row }) => <StockReceiptStatusChip status={row.status} />,
      },
      {
        field: "actions",
        type: "actions",
        headerName: t("headers.actions"),
        flex: 1,
        getActions: ({ row }) => [
          <GridLinkAction
            key="view"
            to={getPath("stocks.stock", { id: row.id.toString() })}
            icon={<ViewAgendaTwoTone />}
            label={t("actions.view")}
            showInMenu
          />,
          <GridActionsCellItem
            key="cancel"
            icon={<CancelTwoTone />}
            onClick={menu.cancel(row)}
            disabled={
              !permissions(row).canCancelStock ||
              row.status !== StockReceiptStatus.DRAFT
            }
            label={t("actions.cancel")}
            showInMenu
          />,
          <GridActionsCellItem
            key="export"
            icon={<DownloadTwoTone />}
            onClick={menu.export(row)}
            label={t("actions.export")}
            showInMenu
          />,
        ],
      },
    ];
  };

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs
          value={filterType}
          onChange={(_, value) => setFilterType(value)}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label={ts("all")} value="all" />
          <Tab label={ts("completed")} value="completed" />
          <Tab label={ts("draft")} value="draft" />
          <Tab label={ts("cancelled")} value="cancelled" />
        </Tabs>
      </Box>

      <Datatable
        name={"stocks_histories"}
        columns={columns()}
        fetch={getStockReceiptDatatable}
        bridge={[filterType]}
        height={700}
      />

      {ExportHandler}
      <Confirmation {...cancelConfirmation.props} />
    </>
  );
};

export default HistoryDatatable;
