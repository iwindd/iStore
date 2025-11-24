"use client";
import { ButtonProps, Paper } from "@mui/material";
import {
  DataGrid,
  DataGridProps,
  GridCellParams,
  gridClasses,
  GridColDef,
  GridFilterModel,
  GridPaginationModel,
  GridRowClassNameParams,
  GridSortModel,
  GridValidRowModel,
} from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import React from "react";
import thTHGrid from "./locale/datatable";

export interface TableOption {
  title: string;
  Icon: React.FC;
  props: ButtonProps;
  onClick: () => void;
}

export interface TableFetch {
  sort: GridSortModel;
  pagination: GridPaginationModel;
  filter: GridFilterModel;
}

export interface DatatableProps<T extends GridValidRowModel = any> {
  columns: GridColDef<T>[];
  burger?: boolean;

  loading?: boolean;
  name: string;
  height?: string | number;

  fetch: (payload: TableFetch, ...args: any) => any;
  bridge?: any[];

  selectRow?: number;
  setSelectRow?: React.Dispatch<React.SetStateAction<number>>;
  processRowUpdate?: (newData: any, oldData: any) => void;
  getRowClassName?: (params: GridRowClassNameParams) => string;
  getCellClassName?: (params: GridCellParams) => string;

  onDoubleClick?: (data: any) => void;
  overwrite?: DataGridProps;
  onExport?(): void;
}

const Datatable = (props: DatatableProps) => {
  const [rows, setRows] = React.useState<any[]>([]);
  const [total, setTotal] = React.useState<number>(0);
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 15,
  });
  const [sortModel, setSortModel] = React.useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = React.useState<GridFilterModel>({
    items: [],
  });

  const { data, isLoading } = useQuery({
    queryKey: [
      props.name, // will be removed soon (use datatable:name instead)
      `datatable:${props.name}`,
      paginationModel,
      paginationModel,
      sortModel,
      filterModel,
    ],
    queryFn: async () => {
      return await props.fetch(
        {
          sort: sortModel,
          pagination: paginationModel,
          filter: filterModel,
        },
        ...(props.bridge || [])
      );
    },
  });

  React.useEffect(() => {
    let isSuccess = data?.success || data?.state;

    if (
      !isSuccess &&
      data?.success === undefined &&
      data?.state === undefined
    ) {
      isSuccess = true;
    }

    if (isSuccess && data) {
      setRows(data.data);
      setTotal(data.total || 0);
    }
  }, [data, setRows, setTotal]);

  const processRowUpdateMiddleware = (newData: any, oldData: any) => {
    if (!props.processRowUpdate) return oldData;
    if (_.isEqual(newData, oldData)) return oldData;

    return props.processRowUpdate(newData, oldData);
  };

  return (
    <Paper
      sx={{
        height: props.height ?? 700,
        width: "100%",
      }}
    >
      <DataGrid
        rows={rows}
        columns={props.columns}
        loading={isLoading || props.loading}
        rowCount={total}
        localeText={thTHGrid}
        pageSizeOptions={[15, 30, 50, 100]}
        processRowUpdate={processRowUpdateMiddleware}
        onRowDoubleClick={props.onDoubleClick}
        getRowClassName={props.getRowClassName}
        getCellClassName={props.getCellClassName}
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
        showToolbar
        paginationMode="server"
        sortingMode="server"
        filterMode="server"
        onPaginationModelChange={setPaginationModel}
        onSortModelChange={setSortModel}
        onFilterModelChange={setFilterModel}
        {...props.overwrite}
      />
    </Paper>
  );
};

export default Datatable;
