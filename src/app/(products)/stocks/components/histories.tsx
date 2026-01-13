"use client";
import CancelStock from "@/actions/stock/cancel";
import fetchStockDatatable, {
  StockDatatableInstance,
} from "@/actions/stock/fetchStockDatatable";
import getExportStockData from "@/actions/stock/getExportStockReceiptData";
import Datatable from "@/components/Datatable";
import GridLinkAction from "@/components/GridLinkAction";
import { StockPermissionEnum } from "@/enums/permission";
import { useAuth } from "@/hooks/use-auth";
import { Confirmation, useConfirm } from "@/hooks/use-confirm";
import { useExport } from "@/hooks/use-export";
import { Colorization } from "@/libs/colorization";
import * as ff from "@/libs/formatter";
import { useInterface } from "@/providers/InterfaceProvider";
import { getPath } from "@/router";
import {
  CancelTwoTone,
  DownloadTwoTone,
  ViewAgendaTwoTone,
} from "@mui/icons-material";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { StockReceiptStatus } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import React from "react";

const HistoryDatatable = () => {
  const { setBackdrop } = useInterface();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const permissions = (stock: StockDatatableInstance) => ({
    canCancelStock:
      user?.hasPermission(StockPermissionEnum.DELETE) ||
      stock.creator?.id === user?.userStoreId,
    canCreateStock: user?.hasPermission(StockPermissionEnum.CREATE),
  });

  const { setItems, Export, ExportHandler } = useExport([
    { label: "รหัสสินค้า", key: "serial" },
    { label: "ชื่อสินค้า", key: "label" },
    { label: "ราคา", key: "price" },
    { label: "ต้นทุน", key: "cost" },
    { label: "จำนวน", key: "delta" },
    { label: "อื่นๆ", key: "keywords" },
  ]);

  const cancelConfirmation = useConfirm({
    title: "แจ้งเตือน",
    text: "คุณต้องการที่จะยกเลิกรายการสต๊อกหรือไม่?",
    onConfirm: async (id: number) => {
      try {
        const resp = await CancelStock(id);

        if (!resp.success) throw new Error(resp.message);
        enqueueSnackbar(`ยกเลิกรายการสต๊อกหมายเลข #${ff.number(id)} แล้ว!`, {
          variant: "success",
        });
        await queryClient.refetchQueries({
          queryKey: ["stocks_histories"],
          type: "active",
        });
      } catch (error) {
        console.error(error);
        enqueueSnackbar("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้งภายหลัง", {
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
          }))
        );
        Export();
      } catch (error) {
        console.error(error);
        enqueueSnackbar("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้งภายหลัง", {
          variant: "error",
        });
      } finally {
        setBackdrop(false);
      }
    },
    [setBackdrop, setItems, Export]
  );

  const menu = {
    cancel: React.useCallback(
      (row: StockDatatableInstance) => () => {
        cancelConfirmation.with(row.id);
        cancelConfirmation.handleOpen();
      },
      [cancelConfirmation]
    ),
    export: React.useCallback(
      (row: StockDatatableInstance) => () => {
        onExport(row.id);
      },
      [onExport]
    ),
  };

  const columns = (): GridColDef<StockDatatableInstance>[] => {
    return [
      {
        field: "action_at",
        sortable: true,
        headerName: "วันที่ทำรายการ",
        flex: 2,
        editable: false,
        renderCell: ({ row }) => ff.date(row.action_at),
      },
      {
        field: "creator",
        sortable: true,
        headerName: "ผู้สร้างรายการ",
        flex: 2,
        renderCell: ({ row }) => ff.text(row.creator?.user.name || "ไม่ระบุ"),
      },
      {
        field: "_count",
        sortable: false,
        headerName: "จำนวนสินค้า",
        flex: 2,
        editable: false,
        renderCell: ({ row }) =>
          `${ff.number(row._count.stock_recept_products)} รายการ`,
      },
      {
        field: "note",
        sortable: true,
        headerName: "หมายเหตุ",
        flex: 3,
        editable: false,
        renderCell: ({ row }) => ff.text(row.note || "ไม่ระบุ"),
      },
      {
        field: "state",
        sortable: true,
        headerName: "สถานะ",
        flex: 2,
        editable: false,
        renderCell: ({ row }) => ff.stockReceiptStatus(row.state),
      },
      {
        field: "actions",
        type: "actions",
        headerName: "เครื่องมือ",
        flex: 1,
        getActions: ({ row }) => [
          <GridLinkAction
            key="view"
            to={getPath("stocks.stock", { id: row.id.toString() })}
            icon={<ViewAgendaTwoTone />}
            label="ดูรายละเอียด"
            showInMenu
          />,
          <GridActionsCellItem
            key="cancel"
            icon={<CancelTwoTone />}
            onClick={menu.cancel(row)}
            disabled={
              !permissions(row).canCancelStock ||
              row.state !== StockReceiptStatus.DRAFT
            }
            label="ยกเลิกรายการนี้"
            showInMenu
          />,
          <GridActionsCellItem
            key="export"
            icon={<DownloadTwoTone />}
            onClick={menu.export(row)}
            label="Export"
            showInMenu
          />,
        ],
      },
    ];
  };

  return (
    <>
      <Datatable
        name={"stocks_histories"}
        columns={columns()}
        fetch={fetchStockDatatable}
        height={700}
        getCellClassName={Colorization.getGridCellColorForStockReceiptStatus}
      />

      {ExportHandler}
      <Confirmation {...cancelConfirmation.props} />
    </>
  );
};

export default HistoryDatatable;
