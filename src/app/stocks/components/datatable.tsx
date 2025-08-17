"use client";
import React from "react";
import * as ff from "@/libs/formatter";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridToolbar,
  gridClasses,
} from "@mui/x-data-grid";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  Divider,
  IconButton,
  IconButtonProps,
  Paper,
  styled,
} from "@mui/material";
import thTHGrid from "@/components/locale/datatable";
import { useStock } from "@/hooks/use-stock";
import { StockItem } from "@/atoms/stock";
import { DeleteTwoTone, ExpandMoreTwoTone } from "@mui/icons-material";
import { Product } from "@prisma/client";
import CommitController from "./commit-controller";
import { Confirmation, useConfirm } from "@/hooks/use-confirm";
import { enqueueSnackbar } from "notistack";
import { useAuth } from "@/hooks/use-auth";
import { StockPermissionEnum } from "@/enums/permission";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const StockDatatable = () => {
  const { target, stocks, addProduct, setStocks, setTarget } = useStock();
  const [expanded, setExpanded] = React.useState(false);
  const { user } = useAuth();
  const permissions = {
    canCreateStock: user?.hasPermission(StockPermissionEnum.CREATE),
    canUpdateStock: user?.hasPermission(StockPermissionEnum.UPDATE),
  } 

  const clearConfirmation = useConfirm({
    title: "แจ้งเตือน",
    text: "คุณต้องการล้างรายการสต๊อกหรือไม่?",
    confirmProps: {
      color: "warning",
      startIcon: <DeleteTwoTone />,
    },
    confirm: "ล้างสต๊อก",
    onConfirm: async () => {
      setStocks([]);
      setTarget(null)
      enqueueSnackbar(`ล้างสต๊อกแล้ว!`, {
        variant: "success",
      });
    },
  });


  const menu = {
    delete: React.useCallback(
      (stock: StockItem) => () => {
        addProduct(stock as unknown as Product, 0);
      },
      [addProduct]
    ),
  };

  const columns = (): GridColDef[] => {
    return [
      { field: "serial", flex: 1, sortable: true, headerName: "#" },
      { field: "label", flex: 1, sortable: true, headerName: "ชื่อสินค้า" },
      {
        field: "stock",
        flex: 1,
        sortable: true,
        headerName: "คงเหลือ",
        renderCell: (data: any) => `${ff.number(data.value)} รายการ`,
      },
      {
        field: "payload",
        flex: 1,
        sortable: true,
        editable: true,
        headerName: "เปลี่ยนแปลง",
        renderCell: (data: any) =>
          `${data.value > 0 ? "+" : "-"} ${
            ff.absNumber(data.value) as string
          } รายการ`,
      },
      {
        field: "all",
        flex: 1,
        sortable: true,
        editable: true,
        headerName: "ยอดรวม",
        renderCell: ({ row }) => `${ff.number(row.stock + row.payload)} รายการ`,
      },
      ...(
        !target ? ([
          {
            field: "actions",
            type: "actions" as const,
            headerName: "เครื่องมือ",
            flex: 1,
            getActions: ({ row }: { row: StockItem }) => [
              <GridActionsCellItem
                key="delete"
                icon={<DeleteTwoTone />}
                onClick={menu.delete(row)}
                label="ลบ"
              />,
            ],
          },
        ]) : ([])
      )
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
      addProduct(oldData, newData.payload);

      return newData;
    }

    if (newData.payload != oldData.payload) {
      if (newData.payload == 0) return oldData;
      addProduct(oldData, newData.payload);

      return newData;
    }

    return newData;
  };

  React.useEffect(() => {
    if (stocks && stocks.length > 0 && !expanded) setExpanded(true);
    if (stocks && stocks.length <= 0 && expanded) setExpanded(false);
  }, [stocks, expanded, setExpanded]);

  return (
    <>
      <Card>
        <CardHeader
          title="รายการสต๊อก"
          subheader={target && `หมายเลขสต๊อก #${ff.number(target || 0)}`}
        />
        <Collapse in={expanded} timeout={"auto"} unmountOnExit>
          <Divider />
          <CardContent sx={{ height: 500, px: 0, py: 0 }}>
            <DataGrid
              localeText={thTHGrid}
              columns={columns()}
              rows={stocks}
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
                params.field == "payload"
                  ? `text-color-${params.value > 0 ? "success" : "error"}`
                  : ""
              }
            />
          </CardContent>
          <Divider />
          <CardActions>
            <Button onClick={clearConfirmation.handleOpen} color="inherit" variant="text" sx={{ ml: "auto" }}>
              ล้าง
            </Button>
            {(permissions.canCreateStock ) && (
              <CommitController />
            )}
          </CardActions>
        </Collapse>
      </Card>
      <Confirmation {...clearConfirmation.props} /> 
    </>
  );
};

export default StockDatatable;
