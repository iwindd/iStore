"use client";
import { ButtonProps, Card, CardContent } from "@mui/material";
import {
  DataGrid,
  DataGridProps,
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
    pageSize: 10,
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
      sortModel,
      filterModel.quickFilterValues,
      bridge,
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
        height: height ?? 701,
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
          pageSizeOptions={[10, 25, 50, 100]}
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
          showToolbar
          paginationMode="server"
          sortingMode="server"
          filterMode="client"
          filterModel={filterModel}
          filterDebounceMs={400}
          paginationModel={paginationModel}
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
