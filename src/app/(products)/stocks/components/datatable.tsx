"use client";
import thTHGrid from "@/components/locale/datatable";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { Colorization } from "@/libs/colorization";
import * as ff from "@/libs/formatter";
import {
  removeProductFromStockById,
  setProductToStockById,
  StockProduct,
} from "@/reducers/stockReducer";
import { DeleteTwoTone } from "@mui/icons-material";
import { Paper, Stack } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  gridClasses,
  GridColDef,
} from "@mui/x-data-grid";
import { useCallback } from "react";

const StockDatatable = () => {
  const currentStockId = useAppSelector((state) => state.stock.id);
  const stockProducts = useAppSelector((state) => state.stock.products);
  const dispatch = useAppDispatch();

  const removeProductFromStock = (product_id: number) => {
    dispatch(removeProductFromStockById(product_id));
  };

  const menu = {
    delete: useCallback(
      (product: StockProduct) => () => {
        removeProductFromStock(product.id);
      },
      [removeProductFromStock]
    ),
  };

  const columns = (): GridColDef<StockProduct>[] => {
    return [
      {
        field: "serial",
        flex: 1,
        sortable: true,
        headerName: "#",
        valueGetter: (_, row) => row.data?.serial,
      },
      {
        field: "label",
        flex: 1,
        sortable: true,
        headerName: "ชื่อสินค้า",
        valueGetter: (_, row) => row.data?.label,
      },
      {
        field: "stock",
        flex: 1,
        sortable: true,
        headerName: "คงเหลือ",
        valueGetter: (_, row) => `${row.data?.stock} รายการ`,
      },
      {
        field: "quantity",
        flex: 1,
        sortable: true,
        editable: true,
        headerName: "เปลี่ยนแปลง",
        renderCell: ({ row }) =>
          `${row.quantity > 0 ? "+" : "-"} ${
            ff.absNumber(row.quantity) as string
          } รายการ`,
      },
      {
        field: "all",
        flex: 1,
        sortable: true,
        editable: true,
        headerName: "ยอดรวม",
        renderCell: ({ row }) =>
          `${ff.number((row.data?.stock || 0) + row.quantity)} รายการ`,
      },
      ...(currentStockId
        ? []
        : [
            {
              field: "actions",
              type: "actions" as const,
              headerName: "เครื่องมือ",
              flex: 1,
              getActions: ({ row }: { row: StockProduct }) => [
                <GridActionsCellItem
                  key="delete"
                  icon={<DeleteTwoTone />}
                  onClick={menu.delete(row)}
                  label="ลบ"
                />,
              ],
            },
          ]),
    ];
  };

  const onUpdate = async (newData: any, oldData: any) => {
    let newAll = Number(newData.all);
    let oldAll = Number(oldData.all);
    newData.payload = Number(newData.payload);
    oldData.payload = Number(oldData.payload);

    if (Number.isNaN(newData.payload)) newData.payload = 0;
    if (Number.isNaN(oldData.payload)) oldData.payload = 0;
    if (Number.isNaN(newAll)) newAll = 0;
    if (Number.isNaN(oldAll)) oldAll = 0;

    if (newAll != oldAll) {
      newData.payload = newData.payload + (newAll - oldAll);

      if (newData.payload == 0) return oldData;
      dispatch(
        setProductToStockById({
          product_id: oldData.id,
          quantity: newData.payload,
        })
      );

      return newData;
    }

    if (newData.payload != oldData.payload) {
      if (newData.payload == 0) return oldData;
      dispatch(
        setProductToStockById({
          product_id: oldData.id,
          quantity: newData.payload,
        })
      );

      return newData;
    }

    return newData;
  };

  return (
    <Stack spacing={2}>
      <Paper
        sx={{
          height: 500,
          width: "100%",
        }}
      >
        <DataGrid
          localeText={thTHGrid}
          columns={columns()}
          rows={stockProducts}
          processRowUpdate={onUpdate}
          showToolbar
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              csvOptions: {
                utf8WithBom: true,
              },
              printOptions: {
                disableToolbarButton: true,
              },
            },
          }}
          sx={{
            borderRadius: "5px",
            "& .MuiDataGrid-row:last-child": {
              "& .MuiDataGrid-cell": {
                borderBottomWidth: 0,
              },
            },
            "& .MuiDataGrid-colCell": {
              backgroundColor: "var(--mui-palette-background-level1)",
              color: "var(--mui-palette-text-secondary)",
              lineHeight: 1,
            },
            "& .MuiDataGrid-checkboxInput": {
              padding: "0 0 0 24px",
            },
            [`& .${gridClasses.columnHeader}`]: {
              backgroundColor: "var(--mui-palette-background-level1)",
              color: "var(--mui-palette-text-secondary)",
            },
            [`& .text-color-primary`]: {
              color: "var(--mui-palette-primary-main)",
            },
            [`& .text-color-secondary`]: {
              color: "var(--mui-palette-secondary-dark)",
            },
            [`& .text-color-info`]: { color: "var(--mui-palette-info-main)" },
            [`& .text-color-warning`]: {
              color: "var(--mui-palette-warning-main)",
            },
            [`& .text-color-success`]: {
              color: "var(--mui-palette-success-main)",
            },
            [`& .text-color-error`]: { color: "var(--mui-palette-error-main)" },
          }}
          getCellClassName={Colorization.getGridCellColorForQuantity}
        />
      </Paper>
    </Stack>
  );
};

export default StockDatatable;
