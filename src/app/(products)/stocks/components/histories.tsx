"use client";
import CancelStock from "@/actions/stock/cancel";
import GetStock from "@/actions/stock/find";
import GetStocks from "@/actions/stock/get";
import ImportToolAction from "@/actions/stock/tool";
import Datatable from "@/components/Datatable";
import { StockPermissionEnum } from "@/enums/permission";
import { useAppDispatch } from "@/hooks";
import { useAuth } from "@/hooks/use-auth";
import { Confirmation, useConfirm } from "@/hooks/use-confirm";
import { useExport } from "@/hooks/use-export";
import * as ff from "@/libs/formatter";
import { useInterface } from "@/providers/InterfaceProvider";
import { setStockId, setStockProducts } from "@/reducers/stockReducer";
import {
  CancelTwoTone,
  DownloadTwoTone,
  RecyclingTwoTone,
  UploadTwoTone,
} from "@mui/icons-material";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { Stock, StockState } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import React from "react";
import { ImportFromStockId, ImportType } from "../import";

const formatCellColor = (status: Stock["state"]) => {
  switch (status) {
    case StockState.PROGRESS:
      return "warning";
    case StockState.SUCCESS:
      return "success";
    case StockState.CANCEL:
      return "secondary";
    default:
      return "secondary";
  }
};

const HistoryDatatable = () => {
  const { setBackdrop } = useInterface();
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const permissions = (stock: Stock) => ({
    canCancelStock:
      user?.hasPermission(StockPermissionEnum.DELETE) ||
      stock.creator_id === user?.userStoreId,
    canCreateStock: user?.hasPermission(StockPermissionEnum.CREATE),
  });

  const { setItems, Export, ExportHandler } = useExport([
    { label: "รหัสสินค้า", key: "serial" },
    { label: "ชื่อสินค้า", key: "label" },
    { label: "ราคา", key: "price" },
    { label: "ต้นทุน", key: "cost" },
    { label: "จำนวน", key: "changed_by" },
    { label: "อื่นๆ", key: "keywords" },
  ]);

  const cancelConfirmation = useConfirm({
    title: "แจ้งเตือน",
    text: "คุณต้องการที่จะยกเลิกรายการสต๊อกหรือไม่?",
    onConfirm: async (id: number) => {
      try {
        const resp = await CancelStock(id);

        if (!resp.success) throw Error(resp.message);
        enqueueSnackbar(`ยกเลิกรายการสต๊อกหมายเลข #${ff.number(id)} แล้ว!`, {
          variant: "success",
        });
        await queryClient.refetchQueries({
          queryKey: ["stocks_histories"],
          type: "active",
        });
      } catch (error) {
        enqueueSnackbar("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้งภายหลัง", {
          variant: "error",
        });
      }
    },
  });

  const copyConfirmation = useConfirm({
    title: "แจ้งเตือน",
    text: "คุณต้องการสร้างรายการนี้อีกครั้งหรือไม่?",
    confirmProps: {
      color: "primary",
      startIcon: <RecyclingTwoTone />,
    },
    confirm: "สร้างรายการอีกครั้ง",
    onConfirm: async (id: number) => {
      try {
        const payload: ImportFromStockId = {
          type: ImportType.FromStockId,
          id: id,
        };
        const resp = await ImportToolAction(payload);
        dispatch(setStockProducts(resp));
        enqueueSnackbar(`สร้างรายการสต๊อกหมายเลข #${ff.number(id)} แล้ว!`, {
          variant: "success",
        });
      } catch (error) {
        enqueueSnackbar("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้งภายหลัง", {
          variant: "error",
        });
      }
    },
  });

  const importConfirmation = useConfirm({
    title: "แจ้งเตือน",
    text: "คุณต้องการนำเข้ารายการนี้หรือไม่?",
    confirmProps: {
      color: "warning",
      startIcon: <UploadTwoTone />,
    },
    confirm: "นำเข้า",
    onConfirm: async (id: number) => {
      try {
        const resp = await ImportToolAction({
          type: ImportType.FromStockId,
          id: id,
        });

        dispatch(setStockProducts(resp));
        dispatch(setStockId(id));
        enqueueSnackbar(`นำเข้ารายการสต๊อกหมายเลข #${ff.number(id)} แล้ว!`, {
          variant: "success",
        });
      } catch (error) {
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
        const resp = await GetStock(stockId, true);
        if (!resp.success || !resp.data || !resp.data.products)
          throw new Error(resp.message);
        setItems(
          resp.data.products.map((item) => ({
            serial: item.product.serial,
            label: item.product.label,
            price: item.product.price,
            cost: item.product.cost,
            changed_by: item.changed_by,
            keywords: item.product.keywords,
          }))
        );
        Export();
      } catch (error) {
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
    import: React.useCallback(
      (row: Stock) => () => {
        importConfirmation.with(row.id);
        importConfirmation.handleOpen();
      },
      [importConfirmation]
    ),
    cancel: React.useCallback(
      (row: Stock) => () => {
        cancelConfirmation.with(row.id);
        cancelConfirmation.handleOpen();
      },
      [cancelConfirmation]
    ),
    copy: React.useCallback(
      (row: Stock) => () => {
        copyConfirmation.with(row.id);
        copyConfirmation.handleOpen();
      },
      [copyConfirmation]
    ),
    export: React.useCallback(
      (row: Stock) => () => {
        onExport(row.id);
      },
      [onExport]
    ),
  };

  const columns = (): GridColDef[] => {
    return [
      {
        field: "action_at",
        sortable: true,
        headerName: "วันที่ทำรายการ",
        flex: 2,
        editable: false,
        renderCell: (data: any) => ff.date(data.value),
      },
      {
        field: "creator",
        sortable: true,
        headerName: "ผู้สร้างรายการ",
        flex: 2,
        renderCell: (data: any) => ff.text(data.value?.user?.name || "ไม่ระบุ"),
      },
      {
        field: "_count",
        sortable: false,
        headerName: "จำนวนสินค้า",
        flex: 2,
        editable: false,
        renderCell: ({ value }) => `${ff.number(value.items)} รายการ`,
      },
      {
        field: "note",
        sortable: true,
        headerName: "หมายเหตุ",
        flex: 3,
        editable: false,
        renderCell: (data: any) => ff.text(data.value),
      },
      {
        field: "state",
        sortable: true,
        headerName: "สถานะ",
        flex: 2,
        editable: false,
        renderCell: (data: any) => ff.stockState(data.value),
      },
      {
        field: "actions",
        type: "actions",
        headerName: "เครื่องมือ",
        flex: 1,
        getActions: ({ row }: { row: Stock }) => [
          <GridActionsCellItem
            key="import"
            icon={<UploadTwoTone />}
            onClick={menu.import(row)}
            label="นำเข้า"
            disabled={row.state != StockState.PROGRESS}
            showInMenu
          />,
          <GridActionsCellItem
            key="cancel"
            icon={<CancelTwoTone />}
            onClick={menu.cancel(row)}
            disabled={
              !permissions(row).canCancelStock ||
              row.state != StockState.PROGRESS
            }
            label="ยกเลิกรายการนี้"
            showInMenu
          />,
          <GridActionsCellItem
            key="copy"
            icon={<RecyclingTwoTone />}
            onClick={menu.copy(row)}
            label="สร้างรายการอีกครั้ง"
            disabled={
              !permissions(row).canCreateStock ||
              row.state == StockState.PROGRESS
            }
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
        fetch={GetStocks}
        height={700}
        getCellClassName={(params) =>
          params.field == "state"
            ? `text-color-${formatCellColor(params.value as Stock["state"])}`
            : ""
        }
      />

      {ExportHandler}
      <Confirmation {...cancelConfirmation.props} />
      <Confirmation {...copyConfirmation.props} />
      <Confirmation {...importConfirmation.props} />
    </>
  );
};

export default HistoryDatatable;
