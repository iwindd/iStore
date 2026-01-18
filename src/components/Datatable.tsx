"use client";
import { ButtonProps, Card, CardContent } from "@mui/material";
import {
  DataGrid,
  DataGridProps,
  gridClasses,
  GridColDef,
  GridFilterModel,
  GridPaginationModel,
  GridSortModel,
  GridValidRowModel,
} from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
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

export interface DatatableProps<
  T extends GridValidRowModel = any,
> extends DataGridProps {
  columns: GridColDef<T>[];
  name: string;
  height?: string | number;
  fetch: (payload: TableFetch, ...args: any) => any;
  bridge?: any[];
}

const Datatable = ({
  columns,
  name,
  height,
  fetch,
  bridge,
  ...props
}: DatatableProps) => {
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
      name, // will be removed soon (use datatable:name instead)
      `datatable:${name}`,
      paginationModel,
      paginationModel,
      sortModel,
      filterModel,
    ],
    queryFn: async () => {
      return await fetch(
        {
          sort: sortModel,
          pagination: paginationModel,
          filter: filterModel,
        },
        ...(bridge || []),
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

  return (
    <Card
      sx={{
        height: height ?? 700,
        width: "100%",
      }}
    >
      <CardContent
        sx={{
          p: 0,

          height: "100%",
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          loading={isLoading || props.loading}
          rowCount={total}
          localeText={thTHGrid}
          pageSizeOptions={[15, 30, 50, 100]}
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
          {...props}
        />
      </CardContent>
    </Card>
  );
};

export default Datatable;
