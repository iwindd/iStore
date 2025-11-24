"use client";
import thTHGrid from "@/components/locale/datatable";
import { StockPermissionEnum } from "@/enums/permission";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useAuth } from "@/hooks/use-auth";
import { Confirmation, useConfirm } from "@/hooks/use-confirm";
import * as ff from "@/libs/formatter";
import {
  removeProductFromStockById,
  resetStock,
  setProductToStockById,
  StockProduct,
} from "@/reducers/stockReducer";
import { DeleteTwoTone } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  Divider,
} from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  gridClasses,
  GridColDef,
  GridToolbar,
} from "@mui/x-data-grid";
import { enqueueSnackbar } from "notistack";
import React, { useCallback, useEffect } from "react";
import CommitController from "./commit-controller";

const StockDatatable = () => {
  const currentStockId = useAppSelector((state) => state.stock.id);
  const stockProducts = useAppSelector((state) => state.stock.products);
  const dispatch = useAppDispatch();
  const [expanded, setExpanded] = React.useState(false);
  const { user } = useAuth();
  const permissions = {
    canCreateStock: user?.hasPermission(StockPermissionEnum.CREATE),
    canUpdateStock: user?.hasPermission(StockPermissionEnum.UPDATE),
  };

  const removeProductFromStock = (product_id: number) => {
    dispatch(removeProductFromStockById(product_id));
  };

  const clearConfirmation = useConfirm({
    title: "แจ้งเตือน",
    text: "คุณต้องการล้างรายการสต๊อกหรือไม่?",
    confirmProps: {
      color: "warning",
      startIcon: <DeleteTwoTone />,
    },
    confirm: "ล้างสต๊อก",
    onConfirm: async () => {
      dispatch(resetStock());
      enqueueSnackbar(`ล้างสต๊อกแล้ว!`, {
        variant: "success",
      });
    },
  });

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
        renderCell: ({ row }) => row.data?.serial,
      },
      {
        field: "label",
        flex: 1,
        sortable: true,
        headerName: "ชื่อสินค้า",
        renderCell: ({ row }) => row.data?.label,
      },
      {
        field: "stock",
        flex: 1,
        sortable: true,
        headerName: "คงเหลือ",
        renderCell: ({ row }) => `${ff.number(row.data?.stock || 0)} รายการ`,
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
      ...(!currentStockId
        ? [
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
          ]
        : []),
    ];
  };

  const onUpdate = async (newData: any, oldData: any) => {
    let newAll = Number(newData.all);
    let oldAll = Number(oldData.all);
    newData.payload = Number(newData.payload);
    oldData.payload = Number(oldData.payload);

    if (isNaN(newData.payload)) newData.payload = 0;
    if (isNaN(oldData.payload)) oldData.payload = 0;
    if (isNaN(newAll)) newAll = 0;
    if (isNaN(oldAll)) oldAll = 0;

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

  useEffect(() => {
    const doingStockManagement =
      stockProducts.length > 0 || currentStockId != null;

    if (doingStockManagement && !expanded) setExpanded(true);
    if (!doingStockManagement && expanded) setExpanded(false);
  }, [currentStockId, stockProducts, expanded, setExpanded]);

  return (
    <>
      <Card>
        <CardHeader
          title="รายการสต๊อก"
          subheader={
            currentStockId && `หมายเลขสต๊อก #${ff.number(currentStockId || 0)}`
          }
        />
        <Collapse in={expanded} timeout={"auto"} unmountOnExit>
          <Divider />
          <CardContent sx={{ height: 500, px: 0, py: 0 }}>
            <DataGrid
              localeText={thTHGrid}
              columns={columns()}
              rows={stockProducts}
              processRowUpdate={onUpdate}
              slots={{
                toolbar: GridToolbar,
              }}
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
                border: 0,
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
                [`& .text-color-info`]: {
                  color: "var(--mui-palette-info-main)",
                },
                [`& .text-color-warning`]: {
                  color: "var(--mui-palette-warning-main)",
                },
                [`& .text-color-success`]: {
                  color: "var(--mui-palette-success-main)",
                },
                [`& .text-color-error`]: {
                  color: "var(--mui-palette-error-main)",
                },
              }}
              getCellClassName={(params) =>
                params.field == "quantity"
                  ? `text-color-${params.value > 0 ? "success" : "error"}`
                  : ""
              }
            />
          </CardContent>
          <Divider />
          <CardActions>
            <Button
              onClick={clearConfirmation.handleOpen}
              color="inherit"
              variant="text"
              sx={{ ml: "auto" }}
            >
              ล้าง
            </Button>
            {permissions.canCreateStock && <CommitController />}
          </CardActions>
        </Collapse>
      </Card>
      <Confirmation {...clearConfirmation.props} />
    </>
  );
};

export default StockDatatable;
